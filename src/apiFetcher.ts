import fetch from 'cross-fetch';
import {
ApiFetcherConfig,
CacheEntry,
CacheStrategy,
FetchOptions,
Logger
} from './types';
import { MemoryCache } from './cache';
import { ConsoleLogger } from './logger';
import { NetworkError, ParseError, TimeoutError } from './errors';


function sleep(ms: number) {
return new Promise((res) => setTimeout(res, ms));
}


function withJitter(ms: number) {
// +/- 50% jitter
const jitterFactor = 0.5;
const change = ms * jitterFactor * (Math.random() * 2 - 1);
return Math.max(0, Math.floor(ms + change));
}

export class ApiFetcher {
private baseURL?: string;
private cacheTTL: number;
private retries: number;
private backoffMs: number;
private maxBackoffMs: number;
private jitter: boolean;
private logger: Logger;
private cache: CacheStrategy<CacheEntry<any>>;


constructor(config: ApiFetcherConfig = {}) {
this.baseURL = config.baseURL;
this.cacheTTL = config.cacheTTL ?? 60_000;
this.retries = config.retries ?? 2;
this.backoffMs = config.backoffMs ?? 100;
this.maxBackoffMs = config.maxBackoffMs ?? 2_000;
this.jitter = config.jitter ?? true;
this.logger = config.logger ?? ConsoleLogger;
this.cache = config.cacheStrategy ?? new MemoryCache<any>();
}

private buildUrl(path: string) {
if (!this.baseURL) return path;
return `${this.baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}


async fetchData<T>(path: string, options: FetchOptions = {}): Promise<T> {
const url = this.buildUrl(path);
const cacheKey = `GET:${url}:${JSON.stringify(options.headers ?? {})}`;


// Check cache
try {
const cached = await this.cache.get(cacheKey);
if (cached) {
this.logger.info('cache hit', cacheKey);
return cached.value as T;
}
this.logger.info('cache miss', cacheKey);
} catch (err) {
this.logger.warn('cache error', err);
}

// Retry loop with exponential backoff
let attempt = 0;
let lastErr: unknown = undefined;


while (attempt <= this.retries) {
const attemptStr = `${attempt + 1}/${this.retries + 1}`;
let controller: AbortController | undefined;
try {
attempt++;
const timeoutMs = options.timeoutMs ?? 10_000;
controller = new AbortController();
const signal = controller.signal;
const timer = setTimeout(() => controller?.abort(), timeoutMs);


this.logger.info('fetch attempt', attemptStr, url);
const res = await fetch(url, { headers: options.headers, signal });
clearTimeout(timer);


if (!res.ok) {
const text = await res.text().catch(() => '');
const message = `HTTP ${res.status} ${res.statusText} ${text}`;
lastErr = new NetworkError(message);
throw lastErr;
}

// parse JSON with safety
let parsed: any;
try {
parsed = await res.json();
} catch (e) {
lastErr = new ParseError('Failed to parse JSON', e);
throw lastErr;
}


// store in cache
try {
await this.cache.set(cacheKey, { value: parsed, expiresAt: Date.now() + this.cacheTTL }, this.cacheTTL);
} catch (e) {
this.logger.warn('failed to set cache', e);
}


return parsed as T;
} catch (err: any) {
if (err?.name === 'AbortError') {
lastErr = new TimeoutError('Request timed out', err);
} else if (err instanceof ParseError) {
// parsing failures should not be retried
this.logger.error('parse error, aborting retries', err);
throw err;
} else if (err instanceof NetworkError || err instanceof TimeoutError || err?.name === 'FetchError') {
// network-ish errors -> retry
lastErr = err;
} else {
// unknown error, wrap and retry
lastErr = new NetworkError('Unknown network error', err);
}


if (attempt > this.retries) break;


// compute backoff
let backoff = Math.min(this.backoffMs * Math.pow(2, attempt - 1), this.maxBackoffMs);
if (this.jitter) backoff = withJitter(backoff);
this.logger.warn(`retrying after ${backoff}ms (attempt ${attemptStr})`);
await sleep(backoff);
}
}


// If we reach here, retries exhausted
this.logger.error('retries exhausted', lastErr);
throw lastErr ?? new NetworkError('Failed to fetch');
}
}
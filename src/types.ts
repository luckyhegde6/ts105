/* eslint-disable @typescript-eslint/no-explicit-any */
export type Awaitable<T> = Promise<T> | T;


export interface FetchOptions {
headers?: Record<string, string>;
timeoutMs?: number; // per-request timeout
}


export interface ApiFetcherConfig {
baseURL?: string;
cacheTTL?: number; // ms
retries?: number;
backoffMs?: number; // base backoff
maxBackoffMs?: number;
jitter?: boolean;
logger?: Logger;
cacheStrategy?: CacheStrategy<any>;
}


export interface CacheEntry<T> {
value: T;
expiresAt: number; // epoch ms
}


export interface CacheStrategy<T> {
get(key: string): Promise<T | undefined> | T | undefined;
set(key: string, value: T, ttlMs: number): Promise<void> | void;
del?(key: string): Promise<void> | void;
}


export interface Logger {
info(...args: any[]): void;
warn(...args: any[]): void;
error(...args: any[]): void;
}
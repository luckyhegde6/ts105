import { CacheStrategy, CacheEntry } from './types';


export class MemoryCache<T> implements CacheStrategy<CacheEntry<T>> {
private map = new Map<string, CacheEntry<T>>();


get(key: string) {
const e = this.map.get(key);
if (!e) return undefined;
if (Date.now() > e.expiresAt) {
this.map.delete(key);
return undefined;
}
return e;
}


set(key: string, value: CacheEntry<T>, ttlMs: number) {
const entry: CacheEntry<T> = {
value: value.value,
expiresAt: Date.now() + ttlMs
};
this.map.set(key, entry);
}


del(key: string) {
this.map.delete(key);
}
}
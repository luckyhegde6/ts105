import { Logger } from './types';


export const ConsoleLogger: Logger = {
info: (...args: any[]) => console.info('[ApiFetcher]', ...args),
warn: (...args: any[]) => console.warn('[ApiFetcher]', ...args),
error: (...args: any[]) => console.error('[ApiFetcher]', ...args)
};
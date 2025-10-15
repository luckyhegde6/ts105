export class ApiError extends Error {
public readonly cause?: unknown;
constructor(message: string, cause?: unknown) {
super(message);
this.name = 'ApiError';
this.cause = cause;
}
}


export class NetworkError extends ApiError {
constructor(message = 'Network error', cause?: unknown) {
super(message, cause);
this.name = 'NetworkError';
}
}


export class TimeoutError extends ApiError {
constructor(message = 'Timeout', cause?: unknown) {
super(message, cause);
this.name = 'TimeoutError';
}
}


export class ParseError extends ApiError {
constructor(message = 'Parse error', cause?: unknown) {
super(message, cause);
this.name = 'ParseError';
}
}
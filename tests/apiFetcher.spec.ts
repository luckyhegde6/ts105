import { ApiFetcher } from '../src/apiFetcher';
import fetchMock from 'jest-fetch-mock';
import { NetworkError, TimeoutError, ParseError } from '../src/errors';


describe('ApiFetcher', () => {
beforeEach(() => {
fetchMock.resetMocks();
});


it('fetches and caches successful response', async () => {
fetchMock.mockResponseOnce(JSON.stringify({ id: 1, title: 'todo' }));


const fetcher = new ApiFetcher({ cacheTTL: 5000, retries: 1, jitter: false });
const data = await fetcher.fetchData<{ id: number; title: string }>('https://api.test/todo');
expect(data.id).toBe(1);
expect(fetchMock.mock.calls.length).toBe(1);


// Second call should hit cache
const cached = await fetcher.fetchData<{ id: number; title: string }>('https://api.test/todo');
expect(cached.title).toBe('todo');
expect(fetchMock.mock.calls.length).toBe(1);
});

it('handles parse errors gracefully', async () => {
fetchMock.mockResponseOnce('not-json');
const fetcher = new ApiFetcher({ retries: 0 });
await expect(fetcher.fetchData('https://api.test/bad')).rejects.toBeInstanceOf(ParseError);
});


it('retries on network failure and eventually fails', async () => {
fetchMock.mockReject(new Error('Network down'));
const fetcher = new ApiFetcher({ retries: 2, backoffMs: 10, jitter: false });
await expect(fetcher.fetchData('https://api.test/fail')).rejects.toBeInstanceOf(NetworkError);
expect(fetchMock.mock.calls.length).toBe(3);
});


it('times out requests exceeding timeoutMs', async () => {
fetchMock.mockImplementationOnce(() =>
new Promise((_res) => setTimeout(() => _res(new Response('{}')), 200))
);
const fetcher = new ApiFetcher({ retries: 0 });
await expect(
fetcher.fetchData('https://api.test/slow', { timeoutMs: 50 })
).rejects.toBeInstanceOf(TimeoutError);
});
});
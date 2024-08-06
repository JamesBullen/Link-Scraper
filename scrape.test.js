import { test, expect } from "@jest/globals";
import { normaliseURL,scrapeURLs } from "./scrape";

test('normaliseURL: https with /', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normaliseURL(input);
    const expected = 'blog.boot.dev/path';

    expect(actual).toEqual(expected);
});

test('normaliseURL: https without /', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normaliseURL(input);
    const expected = 'blog.boot.dev/path';
    
    expect(actual).toEqual(expected);
});

test('normaliseURL: http with /', () => {
    const input = 'http://blog.boot.dev/path/';
    const actual = normaliseURL(input);
    const expected = 'blog.boot.dev/path';
    
    expect(actual).toEqual(expected);
});

test('normaliseURL: https without /', () => {
    const input = 'http://blog.boot.dev/path';
    const actual = normaliseURL(input);
    const expected = 'blog.boot.dev/path';
    
    expect(actual).toEqual(expected);
});
// No point doing tests with random characters, as it'll be interpreted as a relative path. Only erroring out in a later fetch call

test('scrapeURLs: full path', () => {
    const input = ['<html><body><a href="https://blog.boot.dev"></a></body></html>', 'https://blog.boot.dev'];
    const actual = scrapeURLs(input[0], input[1]);
    const expected = ['https://blog.boot.dev/'];
    
    expect(actual).toEqual(expected);
});

test('scrapeURLs: reletive path', () => {
    const input = ['<html><body><a href="/path/one"></a></body></html>', 'https://blog.boot.dev'];
    const actual = scrapeURLs(input[0], input[1]);
    const expected = ['https://blog.boot.dev/path/one'];
    
    expect(actual).toEqual(expected);
});

test('scrapeURLs: no anchors', () => {
    const input = ['<html><body></body></html>', 'https://blog.boot.dev'];
    const actual = scrapeURLs(input[0], input[1]);
    const expected = [];
    
    expect(actual).toEqual(expected);
});

test('scrapeURLs: no href', () => {
    const input = ['<html><body><a></a></body></body></html>', 'https://blog.boot.dev'];
    const actual = scrapeURLs(input[0], input[1]);
    const expected = [];
    
    expect(actual).toEqual(expected);
});

test('scrapeURLs: empty href', () => {
    const input = ['<html><body><a href=""></a></body></html>', 'https://blog.boot.dev'];
    const actual = scrapeURLs(input[0], input[1]);
    const expected = [];
    
    expect(actual).toEqual(expected);
});

// No tests for scrapePage() and fetchHTML() due to requiring a dynamic input that can be externally changed
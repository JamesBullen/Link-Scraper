import { test, expect } from "@jest/globals";
import { printReport, sortPages } from "./report";

test('sortPages: basic sort', () => {
    const input = {'One': 23, 'Two': 12, 'Three': 56};
    const actual = sortPages(input);
    const expected = [['Three', 56] , ['One', 23], ['Two', 12]];
    
    expect(actual).toEqual(expected);
});

test('sortPages: basic sort', () => {
    const input = {'wagslane.dev': 1, 'wagslane.dev/tags': 4, 'wagslane.dev/about': 2, 'wagslane.dev/tags/business': 3};
    const actual = sortPages(input);
    const expected = [[ 'wagslane.dev/tags', 4 ], [ 'wagslane.dev/tags/business', 3 ], [ 'wagslane.dev/about', 2 ], ['wagslane.dev', 1 ]];
    
    expect(actual).toEqual(expected);
});

test('sortPages: empty', () => {
    const input = {};
    const actual = sortPages(input);
    const expected = [];
    
    expect(actual).toEqual(expected);
});

test('sortPages: minus intergers', () => {
    const input = {'wagslane.dev': 1, 'wagslane.dev/tags': -1, 'wagslane.dev/about': 1, 'wagslane.dev/tags/business': 11};
    const actual = sortPages(input);
    const expected = [[ 'wagslane.dev/tags/business', 11 ], ['wagslane.dev', 1 ], [ 'wagslane.dev/about', 1 ], [ 'wagslane.dev/tags', -1 ]];
    
    expect(actual).toEqual(expected);
});
import { canVote } from "../../js-coding/can-vote.js";
import { test, expect } from "@playwright/test";


test('String value return error', () => {
    const testParam = 'is String'
    expect(() => canVote(testParam)).toThrow("Передайте число")
});

test('user younger then 18 cannot vote', () => {
    expect(canVote(1)).toBe(false);
});

test('negative age  cannot vote', () => { 
    expect(canVote(-19)).toBe(false);
});

test('18 age can vote', () => { 
    expect(canVote(18)).toBe(true);
});

test('older then 18 age can vote', () => { 
    expect(canVote(33)).toBe(true);
});

test('NaN is handled by CanVote', () => { 
    expect(() => canVote(NaN)).toThrow("Передайте число")  
});
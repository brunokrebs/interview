// Run with:  node --test
//
// Stages are gated behind SKIP flags so you can reveal them one at a time.
// Flip a stage's `skip` to false when you hand it to the candidate.

import test from 'node:test';
import assert from 'node:assert/strict';
import { TTLCache } from './cache.mjs';

// Small helper so tests don't sleep in real time. The candidate's cache
// should read time via an injectable clock (see Stage 2 discussion) OR the
// tests can await real timers — interviewer's choice. Default: fake clock.
function withClock() {
  let now = 0;
  return { now: () => now, advance: (ms) => { now += ms; } };
}

// ---------- Stage 1: basic get/set ----------
test('stores and retrieves a value', () => {
  const c = new TTLCache();
  c.set('a', 1);
  assert.equal(c.get('a'), 1);
});

test('returns undefined for missing keys', () => {
  const c = new TTLCache();
  assert.equal(c.get('nope'), undefined);
});

test('overwrites an existing key', () => {
  const c = new TTLCache();
  c.set('a', 1);
  c.set('a', 2);
  assert.equal(c.get('a'), 2);
});

// ---------- Stage 2: TTL expiry ----------
test('entry expires after its ttl', { skip: true }, () => {
  const clock = withClock();
  const c = new TTLCache({ ttlMs: 100, now: clock.now });
  c.set('a', 1);
  clock.advance(99);
  assert.equal(c.get('a'), 1);   // still alive
  clock.advance(2);
  assert.equal(c.get('a'), undefined); // expired
});

test('per-entry ttl overrides default', { skip: true }, () => {
  const clock = withClock();
  const c = new TTLCache({ ttlMs: 100, now: clock.now });
  c.set('a', 1, 10);
  clock.advance(11);
  assert.equal(c.get('a'), undefined);
});

test('size reflects only live entries', { skip: true }, () => {
  const clock = withClock();
  const c = new TTLCache({ ttlMs: 100, now: clock.now });
  c.set('a', 1);
  c.set('b', 2);
  clock.advance(101);
  assert.equal(c.size, 0);
});

// ---------- Stage 3: capacity + LRU eviction ----------
test('evicts least-recently-used when over capacity', { skip: true }, () => {
  const clock = withClock();
  const c = new TTLCache({ ttlMs: 1e9, maxSize: 2, now: clock.now });
  c.set('a', 1);
  c.set('b', 2);
  c.get('a');        // 'a' is now most-recently used, 'b' is LRU
  c.set('c', 3);     // over capacity -> evict 'b'
  assert.equal(c.get('a'), 1);
  assert.equal(c.get('b'), undefined);
  assert.equal(c.get('c'), 3);
});

// ---------- Stage 4 (stretch): async single-flight ----------
// getOrLoad(key, loader): if a load for `key` is already in flight, callers
// share the same promise instead of each running `loader`. See interviewer notes.
test('getOrLoad dedupes concurrent loads', { skip: true }, async () => {
  const c = new TTLCache({ ttlMs: 1e9 });
  let calls = 0;
  const loader = async () => { calls++; await Promise.resolve(); return 42; };
  const [a, b] = await Promise.all([
    c.getOrLoad('k', loader),
    c.getOrLoad('k', loader),
  ]);
  assert.equal(a, 42);
  assert.equal(b, 42);
  assert.equal(calls, 1); // loader ran once, not twice
});

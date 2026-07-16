# Coding Exercise: TTL Cache

A small live-coding exercise. Implement an in-memory cache with time-to-live, built up in stages.

## Running

Requires Node 22+ (uses the built-in test runner, zero dependencies).

```bash
node --test
```

## Your task

Implement the `TTLCache` class in `cache.mjs`. Stage 1 tests are active; later stages are gated behind `{ skip: true }` in `cache.test.mjs` and will be revealed during the session.

Think out loud and talk through trade-offs as you go.

### Stages

1. **get / set** — store and retrieve values.
2. **TTL expiry** — entries expire after their time-to-live.
3. **Capacity + LRU eviction** — bound the cache size, evicting the least-recently-used entry.
4. **Stretch: async single-flight** — concurrent loads for the same key share one in-flight request.

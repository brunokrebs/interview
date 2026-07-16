// Starter code — implement the TTLCache class.
//
// The candidate fills in the method bodies. Signatures are a suggestion,
// not a straitjacket — they're allowed to change them if they explain why.

export class TTLCache {
  /**
   * @param {object} [opts]
   * @param {number} [opts.ttlMs]    default time-to-live for entries, in ms
   * @param {number} [opts.maxSize]  max number of live entries (Stage 3)
   */
  constructor(opts = {}) {
    // TODO
  }

  /**
   * Store a value. Optional per-entry ttl overrides the default.
   * @param {string} key
   * @param {*} value
   * @param {number} [ttlMs]
   */
  set(key, value, ttlMs) {
    // TODO
  }

  /**
   * Return the value, or undefined if missing or expired.
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    // TODO
  }

  /** Number of live (non-expired) entries. */
  get size() {
    // TODO
    return 0;
  }
}

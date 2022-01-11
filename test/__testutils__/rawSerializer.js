const raw = new Set();

expect.addSnapshotSerializer({
  test(value) {
    return typeof value == "string" && raw.has(value);
  },
  serialize(value) {
    return value;
  },
});

/**
 * @param {string} snapshot
 * @returns {void}
 */
module.exports = function registerRawSnapshot(snapshot) {
  raw.add(snapshot);
};

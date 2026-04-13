/**
 * Returns a stable UTC timestamp string for archive operations.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function getArchiveTimestamp(date = new Date()) {
  return date.toISOString();
}
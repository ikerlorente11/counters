/**
 * Safely parses an integer and falls back when parsing fails.
 * @param {unknown} value
 * @param {number} [defaultValue=0]
 * @returns {number}
 */
export const toSafeInt = (value, defaultValue = 0) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
};

/**
 * Trims the title and guarantees a non-empty label.
 * @param {unknown} title
 * @returns {string}
 */
export const normalizeTitle = (title) => {
  const trimmedTitle = (title ?? "").toString().trim();
  return trimmedTitle.length > 0 ? trimmedTitle : "Counter";
};

/**
 * Validates and normalizes counter form payload.
 * @param {{title: unknown, value: unknown, color: string, bgColor: string}} params
 * @returns {{isValid: true, payload: {title: string, value: number, color: string, bgColor: string}} | {isValid: false, error: string}}
 */
export const buildValidatedCounterPayload = ({ title, value, color, bgColor }) => {
  const normalizedTitle = normalizeTitle(title);
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue)) {
    return {
      isValid: false,
      error: "Value must be a valid integer.",
    };
  }

  return {
    isValid: true,
    payload: {
      title: normalizedTitle,
      value: parsedValue,
      color,
      bgColor,
    },
  };
};

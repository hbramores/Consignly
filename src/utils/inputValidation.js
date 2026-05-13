const TEXT_CHARS = /[^A-Za-z0-9\s.,'&()/#:;!?%+@_-]/g;
const NAME_CHARS = /[^A-Za-z0-9\s.,'&()/_-]/g;
const CODE_CHARS = /[^A-Za-z0-9_-]/g;
const PHONE_CHARS = /[^0-9+() -]/g;
const USERNAME_CHARS = /[^A-Za-z0-9_]/g;

const collapseSpaces = (value) =>
  String(value || "").replace(/\s+/g, " ");

const safeString = (value) => String(value ?? "");

export const limitLength = (value, maxLength) =>
  safeString(value).slice(0, maxLength);

// USERNAME
export const sanitizeUsername = (value) =>
  limitLength(
    safeString(value).replace(USERNAME_CHARS, ""),
    30
  );

// PASSWORD (safe only string cleanup)
export const sanitizePassword = (value) =>
  limitLength(
    safeString(value).replace(/[\r\n]/g, ""),
    72
  );

// CODE (IMPORTANT: always string)
export const sanitizeCode = (value) =>
  limitLength(
    safeString(value)
      .replace(CODE_CHARS, "")
      .toUpperCase(),
    40
  );

// PHONE
export const sanitizePhone = (value) =>
  limitLength(
    safeString(value).replace(PHONE_CHARS, ""),
    20
  );

// NAME TEXT
export const sanitizeNameText = (value, maxLength = 100) =>
  limitLength(
    collapseSpaces(safeString(value).replace(NAME_CHARS, "")),
    maxLength
  );

// FREE TEXT
export const sanitizeFreeText = (value, maxLength = 255) =>
  limitLength(
    safeString(value).replace(TEXT_CHARS, ""),
    maxLength
  );

// DECIMAL (SAFE FIX — this was risky before)
export const sanitizeDecimal = (value) => {
  const cleaned = safeString(value).replace(/[^0-9.]/g, "");

  const parts = cleaned.split(".");
  const whole = parts[0] || "";
  const decimal = parts.slice(1).join("");

  if (parts.length > 1) {
    return `${whole}.${decimal.slice(0, 2)}`;
  }

  return whole;
};

// INTEGER (SAFE FIX)
export const sanitizeInteger = (value, { allowNegative = false } = {}) => {
  const str = safeString(value);

  const sign =
    allowNegative && str.trim().startsWith("-") ? "-" : "";

  const digits = str.replace(/[^0-9]/g, "");

  return sign + digits;
};

// PERCENTAGE (SAFE FIX)
export const sanitizePercentage = (value) => {
  const sanitized = sanitizeDecimal(value);

  if (!sanitized) return "";

  const numericValue = Number(sanitized);

  if (Number.isNaN(numericValue)) return "";

  return String(Math.min(numericValue, 100));
};

// VALIDATORS (unchanged but safe)
export const isValidUsername = (value) =>
  /^[A-Za-z0-9_]{3,30}$/.test(String(value || ""));

export const isValidPassword = (value) =>
  (value || "").length >= 6 && (value || "").length <= 72;

export const isPositiveNumber = (value) =>
  Number(value) > 0;

export const isNonEmpty = (value) =>
  String(value || "").trim().length > 0;
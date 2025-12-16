/**
 * Input validation and sanitization utilities.
 */

// Configuration
export const MAX_NOTE_LENGTH = 500;
export const MAX_RECORDS = 1000;

/**
 * Validate date string format (YYYY-MM-DD) and check it's a real date.
 */
export function isValidDate(dateString: string): boolean {
  // Check format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  // Check it's a real date
  const date = new Date(dateString + "T00:00:00Z");
  if (isNaN(date.getTime())) {
    return false;
  }

  // Verify the date parts match (catches invalid dates like 2024-02-30)
  const [year, month, day] = dateString.split("-").map(Number);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

/**
 * Check if a date is not in the future.
 */
export function isNotFutureDate(dateString: string): boolean {
  const date = new Date(dateString + "T23:59:59Z");
  const now = new Date();
  return date <= now;
}

/**
 * Sanitize a string by escaping HTML entities.
 * Prevents XSS when the string is rendered in the browser.
 */
export function sanitizeHtml(input: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

/**
 * Sanitize and truncate a note string.
 */
export function sanitizeNote(note: string): string {
  if (!note || typeof note !== "string") {
    return "";
  }

  // Trim whitespace
  let sanitized = note.trim();

  // Truncate to max length
  if (sanitized.length > MAX_NOTE_LENGTH) {
    sanitized = sanitized.slice(0, MAX_NOTE_LENGTH);
  }

  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Escape HTML entities
  sanitized = sanitizeHtml(sanitized);

  return sanitized;
}

/**
 * Validate and sanitize the add miss request body.
 */
export interface ValidatedMissInput {
  date: string;
  note: string;
}

export interface ValidationResult {
  valid: boolean;
  data?: ValidatedMissInput;
  error?: string;
}

export function validateMissInput(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { date, note } = body as Record<string, unknown>;

  // Validate date
  if (!date || typeof date !== "string") {
    return { valid: false, error: "Date is required" };
  }

  if (!isValidDate(date)) {
    return { valid: false, error: "Invalid date format. Use YYYY-MM-DD" };
  }

  if (!isNotFutureDate(date)) {
    return { valid: false, error: "Date cannot be in the future" };
  }

  // Validate and sanitize note
  const noteValue = note ?? "";
  if (typeof noteValue !== "string") {
    return { valid: false, error: "Note must be a string" };
  }

  const sanitizedNote = sanitizeNote(noteValue);

  return {
    valid: true,
    data: {
      date,
      note: sanitizedNote,
    },
  };
}

/**
 * Validate ID format (nanoid produces alphanumeric IDs).
 */
export function isValidId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }

  // nanoid(10) produces 10-character alphanumeric strings
  const idRegex = /^[A-Za-z0-9_-]{10}$/;
  return idRegex.test(id);
}

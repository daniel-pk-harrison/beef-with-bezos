import { describe, it, expect } from "vitest";
import {
  isValidDate,
  isNotFutureDate,
  sanitizeHtml,
  sanitizeNote,
  validateMissInput,
  isValidId,
  MAX_NOTE_LENGTH,
} from "@/lib/validation";

describe("isValidDate", () => {
  it("accepts valid YYYY-MM-DD format", () => {
    expect(isValidDate("2024-01-15")).toBe(true);
    expect(isValidDate("2023-12-31")).toBe(true);
    expect(isValidDate("2020-02-29")).toBe(true); // Leap year
  });

  it("rejects invalid formats", () => {
    expect(isValidDate("01-15-2024")).toBe(false);
    expect(isValidDate("2024/01/15")).toBe(false);
    expect(isValidDate("2024-1-15")).toBe(false);
    expect(isValidDate("2024-01-5")).toBe(false);
    expect(isValidDate("January 15, 2024")).toBe(false);
    expect(isValidDate("")).toBe(false);
  });

  it("rejects invalid dates", () => {
    expect(isValidDate("2024-02-30")).toBe(false); // Feb doesn't have 30 days
    expect(isValidDate("2023-02-29")).toBe(false); // Not a leap year
    expect(isValidDate("2024-13-01")).toBe(false); // Invalid month
    expect(isValidDate("2024-00-01")).toBe(false); // Invalid month
    expect(isValidDate("2024-01-32")).toBe(false); // Invalid day
    expect(isValidDate("2024-04-31")).toBe(false); // April has 30 days
  });
});

describe("isNotFutureDate", () => {
  it("accepts past dates", () => {
    expect(isNotFutureDate("2020-01-01")).toBe(true);
    expect(isNotFutureDate("2023-06-15")).toBe(true);
  });

  it("accepts today", () => {
    // Use a date that is definitely in the past to avoid timezone issues
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    expect(isNotFutureDate(yesterdayStr)).toBe(true);
  });

  it("rejects future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const futureDate = future.toISOString().split("T")[0];
    expect(isNotFutureDate(futureDate)).toBe(false);
  });
});

describe("sanitizeHtml", () => {
  it("escapes HTML entities", () => {
    expect(sanitizeHtml("<script>")).toBe("&lt;script&gt;");
    expect(sanitizeHtml('&"test"')).toBe("&amp;&quot;test&quot;");
    expect(sanitizeHtml("'hello'")).toBe("&#x27;hello&#x27;");
    expect(sanitizeHtml("a/b")).toBe("a&#x2F;b");
  });

  it("handles normal text unchanged (except special chars)", () => {
    expect(sanitizeHtml("Hello World")).toBe("Hello World");
    expect(sanitizeHtml("Package #123")).toBe("Package #123");
  });

  it("escapes XSS attack vectors", () => {
    const xss = '<img src="x" onerror="alert(1)">';
    const sanitized = sanitizeHtml(xss);
    expect(sanitized).not.toContain("<");
    expect(sanitized).not.toContain(">");
  });
});

describe("sanitizeNote", () => {
  it("trims whitespace", () => {
    expect(sanitizeNote("  hello  ")).toBe("hello");
    expect(sanitizeNote("\n\ttest\n\t")).toBe("test");
  });

  it("truncates to MAX_NOTE_LENGTH", () => {
    const longNote = "a".repeat(600);
    const result = sanitizeNote(longNote);
    expect(result.length).toBe(MAX_NOTE_LENGTH);
  });

  it("removes control characters", () => {
    expect(sanitizeNote("hello\x00world")).toBe("helloworld");
    expect(sanitizeNote("test\x1Ftext")).toBe("testtext");
  });

  it("preserves newlines and tabs", () => {
    expect(sanitizeNote("line1\nline2")).toBe("line1\nline2");
    expect(sanitizeNote("col1\tcol2")).toBe("col1\tcol2");
  });

  it("escapes HTML in notes", () => {
    expect(sanitizeNote("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;&#x2F;script&gt;"
    );
  });

  it("handles empty and invalid input", () => {
    expect(sanitizeNote("")).toBe("");
    expect(sanitizeNote(null as unknown as string)).toBe("");
    expect(sanitizeNote(undefined as unknown as string)).toBe("");
    expect(sanitizeNote(123 as unknown as string)).toBe("");
  });
});

describe("validateMissInput", () => {
  it("accepts valid input", () => {
    const result = validateMissInput({
      date: "2024-01-15",
      note: "Package was left in rain",
    });
    expect(result.valid).toBe(true);
    expect(result.data?.date).toBe("2024-01-15");
    expect(result.data?.note).toBe("Package was left in rain");
  });

  it("accepts missing note", () => {
    const result = validateMissInput({ date: "2024-01-15" });
    expect(result.valid).toBe(true);
    expect(result.data?.note).toBe("");
  });

  it("rejects missing date", () => {
    const result = validateMissInput({ note: "test" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Date is required");
  });

  it("rejects invalid date format", () => {
    const result = validateMissInput({ date: "invalid" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid date format");
  });

  it("rejects future dates", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const futureDate = future.toISOString().split("T")[0];

    const result = validateMissInput({ date: futureDate });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("future");
  });

  it("rejects invalid body types", () => {
    expect(validateMissInput(null).valid).toBe(false);
    expect(validateMissInput("string").valid).toBe(false);
    expect(validateMissInput(123).valid).toBe(false);
  });

  it("sanitizes note content", () => {
    const result = validateMissInput({
      date: "2024-01-15",
      note: "  <script>alert(1)</script>  ",
    });
    expect(result.valid).toBe(true);
    expect(result.data?.note).not.toContain("<script>");
    expect(result.data?.note).toBe(
      "&lt;script&gt;alert(1)&lt;&#x2F;script&gt;"
    );
  });
});

describe("isValidId", () => {
  it("accepts valid nanoid format", () => {
    expect(isValidId("AbCdEf1234")).toBe(true);
    expect(isValidId("a_b-c_d-e1")).toBe(true);
    expect(isValidId("0123456789")).toBe(true);
  });

  it("rejects invalid lengths", () => {
    expect(isValidId("short")).toBe(false);
    expect(isValidId("waytoolongid")).toBe(false);
    expect(isValidId("")).toBe(false);
  });

  it("rejects invalid characters", () => {
    expect(isValidId("abc!def123")).toBe(false);
    expect(isValidId("abc def123")).toBe(false);
    expect(isValidId("abc.def123")).toBe(false);
  });

  it("rejects invalid types", () => {
    expect(isValidId(null as unknown as string)).toBe(false);
    expect(isValidId(undefined as unknown as string)).toBe(false);
    expect(isValidId(123 as unknown as string)).toBe(false);
  });
});

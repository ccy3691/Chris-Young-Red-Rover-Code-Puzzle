import { describe, expect, it } from "vitest";
import { formatInput } from "./parser";

const input = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

describe("formatInput", () => {
  it("renders fields in input order", () => {
    expect(formatInput(input, 0)).toBe(
      [
        "- id",
        "- name",
        "- email",
        "- type",
        "  - id",
        "  - name",
        "  - customFields",
        "    - c1",
        "    - c2",
        "    - c3",
        "- externalId",
      ].join("\n"),
    );
  });

  it("renders fields alphabetically", () => {
    expect(formatInput(input, 1)).toBe(
      [
        "- email",
        "- externalId",
        "- id",
        "- name",
        "- type",
        "  - customFields",
        "    - c1",
        "    - c2",
        "    - c3",
        "  - id",
        "  - name",
      ].join("\n"),
    );
  });

  it("throws exception when input doesnt start and end in parentheses", () => {
    expect(() => formatInput("id, name", 0)).toThrow("Input must start and end with parentheses");
  });

  it("throws exception when there are too many parentheses", () => {
    expect(() => formatInput("(a))", 0)).toThrow("Mismatched parentheses in input");
  });

  it("throws exception when there not enough closing parentheses", () => {
    expect(() => formatInput("(a(b)", 0)).toThrow("Mismatched parentheses in input");
  });

  it("simple case: no children", () => {
    expect(formatInput("(id, name)", 0)).toBe("- id\n- name");
  });

  it("complex case: multi-level children", () => {
    expect(formatInput("(a(b(c(d))))", 0)).toBe("- a\n  - b\n    - c\n      - d");
  });

  it("should skip empty children", () => {
    expect(formatInput("(a,,b)", 0)).toBe("- a\n- b");
  });
});

import { Filter } from "bad-words";

const filter = new Filter({ placeHolder: "*" });

// Simple repeated-character + leet-speak normalizer
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e")
    .replace(/4/g, "a").replace(/5/g, "s").replace(/\$/g, "s")
    .replace(/@/g, "a").replace(/!/g, "i")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/(.)\1{2,}/g, "$1$1"); // collapse 3+ repeated chars to 2
}

export function moderateText(text: string): { ok: boolean; reason?: string; type?: "profanity" | "length" | "empty" } {
  if (!text || text.trim().length === 0) {
    return { ok: false, reason: "Comment cannot be empty.", type: "empty" };
  }
  if (text.trim().length < 10) {
    return { ok: false, reason: "Comment is too short (minimum 10 characters).", type: "length" };
  }
  if (text.length > 1000) {
    return { ok: false, reason: "Comment must be under 1000 characters.", type: "length" };
  }

  const norm = normalize(text);
  try {
    if (filter.isProfane(text) || filter.isProfane(norm)) {
      return { ok: false, reason: "Please keep it respectful — your comment contains language that isn't allowed.", type: "profanity" };
    }
  } catch {
    // isProfane can throw on edge cases; treat as clean
  }

  return { ok: true };
}

export function moderateName(name: string): { ok: boolean; reason?: string; type?: "profanity" | "length" | "empty" } {
  if (!name || name.trim().length === 0) {
    return { ok: false, reason: "Name is required.", type: "empty" };
  }
  if (name.trim().length < 2) {
    return { ok: false, reason: "Name is too short (minimum 2 characters).", type: "length" };
  }
  if (name.length > 80) {
    return { ok: false, reason: "Name must be under 80 characters.", type: "length" };
  }

  const norm = normalize(name);
  try {
    if (filter.isProfane(name) || filter.isProfane(norm)) {
      return { ok: false, reason: "Please use an appropriate name.", type: "profanity" };
    }
  } catch {
    // ignore
  }

  return { ok: true };
}

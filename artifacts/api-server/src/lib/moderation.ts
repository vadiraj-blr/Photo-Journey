// Basic profanity / abuse filter
// Checks against a list of common slurs and abusive terms.
// Returns null if clean, or a reason string if flagged.

const BLOCKED = [
  "fuck","shit","cunt","bitch","asshole","bastard","cock","dick","pussy","whore",
  "slut","nigger","nigga","faggot","fag","retard","spic","chink","kike","twat",
  "wank","wanker","piss","arse","bollocks","motherfucker","fucker","crap",
  "damn","hell", // allow these — too common; remove from list
].filter(w => !["damn","hell","crap"].includes(w));

// Simple repeated-character normalizer: "fuuuuck" → "fuck"
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // strip punctuation/leetspeak symbols
    .replace(/(.)\1{2,}/g, "$1$1") // collapse 3+ repeated chars to 2
    .replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e")
    .replace(/4/g, "a").replace(/5/g, "s").replace(/\$/g, "s");
}

export function moderateText(text: string): { ok: boolean; reason?: string } {
  if (!text || text.trim().length === 0) return { ok: false, reason: "Comment cannot be empty." };
  if (text.trim().length < 2) return { ok: false, reason: "Comment is too short." };
  if (text.length > 1000) return { ok: false, reason: "Comment must be under 1000 characters." };

  const norm = normalize(text);
  for (const word of BLOCKED) {
    // whole-word match
    const re = new RegExp(`\\b${word}\\b`, "i");
    if (re.test(norm)) {
      return { ok: false, reason: "Your comment contains language that isn't allowed. Please keep it respectful." };
    }
  }
  return { ok: true };
}

export function moderateName(name: string): { ok: boolean; reason?: string } {
  if (!name || name.trim().length === 0) return { ok: false, reason: "Name is required." };
  if (name.trim().length < 2) return { ok: false, reason: "Name is too short." };
  if (name.length > 80) return { ok: false, reason: "Name must be under 80 characters." };
  return { ok: true };
}

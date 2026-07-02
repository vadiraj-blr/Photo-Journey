import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// POST /api/slides/photo-position
// Writes the objectPosition value for the nth <img> in a slide file.
router.post("/photo-position", (req, res) => {
  const { filepath, imageIndex, x, y } = req.body as {
    filepath: string;
    imageIndex: number;
    x: string;
    y: string;
  };

  if (
    typeof filepath !== "string" ||
    !/^artifacts\/wildpixels-slides\/src\/pages\/slides\/[A-Za-z0-9]+\.tsx$/.test(filepath)
  ) {
    res.status(400).json({ error: "Invalid filepath" });
    return;
  }

  const absPath = path.join(process.cwd(), filepath);

  let content: string;
  try {
    content = fs.readFileSync(absPath, "utf-8");
  } catch {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const idx = typeof imageIndex === "number" ? Math.max(0, Math.floor(imageIndex)) : 0;
  const xNum = parseFloat(String(x));
  const yNum = parseFloat(String(y));

  if (isNaN(xNum) || isNaN(yNum)) {
    res.status(400).json({ error: "Invalid x or y values" });
    return;
  }

  const newPos = `${xNum.toFixed(1)}% ${yNum.toFixed(1)}%`;

  let count = -1;
  let matched = false;

  const updated = content.replace(/<img\b[^>]*?\/>/gs, (match) => {
    count++;
    if (count !== idx) return match;
    matched = true;

    if (/objectPosition:\s*"[^"]*"/.test(match)) {
      return match.replace(/objectPosition:\s*"[^"]*"/, `objectPosition: "${newPos}"`);
    } else if (/objectFit:\s*"[^"]*"/.test(match)) {
      return match.replace(/(objectFit:\s*"[^"]*")/, `$1, objectPosition: "${newPos}"`);
    }
    return match;
  });

  if (!matched) {
    res.status(400).json({ error: `No image found at index ${idx}` });
    return;
  }

  try {
    fs.writeFileSync(absPath, updated, "utf-8");
  } catch {
    res.status(500).json({ error: "Failed to write file" });
    return;
  }

  res.json({ ok: true, position: newPos, filepath });
});

export default router;

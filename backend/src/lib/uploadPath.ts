// lib/uploadPath.ts
import fs from "fs";
import path from "path";

/**
 * Get the absolute path for the "id-cards" folder inside public/
 * Ensures the folder exists (creates if not).
 */
export function getIdCardFolder(): string {
  const uploadDir = path.join(process.cwd(), "public", "id-cards");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
}

import fs from "fs";
import path from "path";

/**
 * Uploads an image from a FormData field (e.g., data.photo)
 * and returns the public URL path.
 *
 * @param {File} file - The image file from FormData (e.g. data.photo)
 * @param {string} folder - Folder name inside /public/uploads/
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadImage(file: File, folder: "bikes" | "stations") {
  if (!file) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  // Ensure folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.png`;
  const filepath = path.join(uploadDir, filename);

  // Save file
  fs.writeFileSync(filepath, buffer);

  // Public URL (Next.js serves /public as root)
  return `/uploads/${folder}/${filename}`;
}

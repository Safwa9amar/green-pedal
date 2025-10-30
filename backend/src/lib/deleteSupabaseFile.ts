// lib/deleteSupabaseFile.ts
import { supabase } from "./supabase";

export async function deleteSupabaseFile(publicUrl: string) {
  try {
    const urlParts = publicUrl.split("/storage/v1/object/public/");
    if (urlParts.length < 2) return;

    const filePath = urlParts[1].split("/").slice(1).join("/"); // remove bucket name prefix
    const bucket = urlParts[1].split("/")[0];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) console.error("Error deleting file from Supabase:", error);
  } catch (err) {
    console.error("Error parsing Supabase URL:", err);
  }
}

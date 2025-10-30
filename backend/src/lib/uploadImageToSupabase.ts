// lib/uploadImage.ts
import { supabase } from "./supabase";
import { randomUUID } from "crypto";

export async function uploadImageToSupabase(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("uploads") // 👈 your bucket name
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload image");
  }

  // Get public URL
  const { data: publicUrl } = supabase.storage
    .from("uploads")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

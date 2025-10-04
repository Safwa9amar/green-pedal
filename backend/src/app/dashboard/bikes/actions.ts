"use server";
import { Bike, BikeStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";

export async function getALlBikes(): Promise<Bike[]> {
  let bikes = await prisma.bike.findMany();
  return bikes;
}

export async function SetBikeToMaintenance(formData: FormData) {
  let id = formData.get("id") as string;

  if (!id) throw new Error("Station ID is required");
  await prisma.bike.update({
    where: { id },
    data: {
      status: "MAINTENANCE",
    },
  });
  revalidatePath("/dashboard/bikes");
}

export async function SetBikeToAvailable(formData: FormData) {
  let id = formData.get("id") as string;

  if (!id) throw new Error("Station ID is required");
  await prisma.bike.update({
    where: { id },
    data: {
      status: "AVAILABLE",
    },
  });
  revalidatePath("/dashboard/bikes");
}

export async function deleteBike(formData: FormData) {
  let id = formData.get("id") as string;

  if (!id) throw new Error("Station ID is required");
  let bike = await prisma.bike.delete({
    where: { id },
  });
  if (bike.photo) {
    const photoPath = path.join(process.cwd(), "public", bike.photo);
    fs.unlinkSync(photoPath);
  }
  revalidatePath("/dashboard/bikes");
}

export type BikeFormValues = {
  name: string;
  photo: File | Blob | null;
  stationId: string;
  status?: BikeStatus;
  currentLocationLat?: number | null;
  currentLocationLng?: number | null;
  stationName?: string;
  batteryLevel?: string;
};

export async function createBike(data: BikeFormValues) {
  let photoUrl: string = "";

  // ✅ Handle photo upload
  if (data.photo) {
    const buffer = Buffer.from(await data.photo.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "bikes");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.png`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    // Next.js will serve files from /public
    photoUrl = `/uploads/bikes/${filename}`;
  }

  // ✅ Step 1: Create bike WITHOUT qrCode (yet)
  let bike = await prisma.bike.create({
    data: {
      stationId: data.stationId,
      status: data.status ?? "AVAILABLE",
      currentLocationLat: data.currentLocationLat ?? null,
      currentLocationLng: data.currentLocationLng ?? null,
      stationName: data.stationName ?? null,
      batteryLevel: data.batteryLevel ?? null,
      // Save uploaded photo path
      photo: photoUrl,
    },
    include: {
      station: true,
    },
  });
  revalidatePath("/dashboard/bikes");

  return bike;
}

export async function updateBike(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const stationId = formData.get("stationId") as string;
    const status = formData.get("status") as string;
    const photoFile = formData.get("photo") as File | null;

    let photoUrl: string | undefined;

    // ✅ Handle new photo upload
    if (photoFile && photoFile.size > 0) {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "bikes");
      const filePath = path.join(uploadDir, `${id}-${photoFile.name}`);

      await writeFile(filePath, buffer);

      // Save relative path to DB (e.g. "/uploads/bikes/bike123.png")
      photoUrl = `/uploads/bikes/${id}-${photoFile.name}`;
    }

    // ✅ Update bike in Prisma
    const updatedBike = await prisma.bike.update({
      where: { id },
      data: {
        name,
        stationId,
        status: status as any, // "AVAILABLE" | "IN_USE" | "MAINTENANCE"
        ...(photoUrl ? { photo: photoUrl } : {}),
      },
      include: {
        station: true,
      },
    });

    // ✅ Revalidate page cache
    revalidatePath("/dashboard/bikes");

    return { success: true, bike: updatedBike };
  } catch (error) {
    console.error("❌ Error updating bike:", error);
    return { success: false, error: "Failed to update bike." };
  }
}

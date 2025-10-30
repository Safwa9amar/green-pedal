"use server";
import { Bike, BikeStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAllStations } from "../stations/actions";
import { uploadImage } from "@/lib/uploadImage";
import { deleteSupabaseFile } from "@/lib/deleteSupabaseFile";
import { uploadImageToSupabase } from "@/lib/uploadImageToSupabase";

// const io = getIO();

export async function getALlBikes(): Promise<Bike[]> {
  return await prisma.bike.findMany({
    include: { specs: true },
  });
}

// ✅ Set bike to maintenance
export async function SetBikeToMaintenance(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Bike ID is required");

  await prisma.bike.update({
    where: { id },
    data: { status: "MAINTENANCE" },
  });

  revalidatePath("/dashboard/bikes");
}

// ✅ Set bike to available
export async function SetBikeToAvailable(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Bike ID is required");

  await prisma.bike.update({
    where: { id },
    data: { status: "AVAILABLE" },
  });

  revalidatePath("/dashboard/bikes");
}

// ✅ Delete bike (with Supabase cleanup)
export async function deleteBike(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Bike ID is required");

  const bike = await prisma.bike.delete({ where: { id } });

  if (bike.photo) {
    await deleteSupabaseFile(bike.photo);
  }

  revalidatePath("/dashboard/bikes");
}

// ✅ Create bike
export async function createBike(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const stationId = formData.get("stationId") as string;
    const status = (formData.get("status") as BikeStatus) ?? "AVAILABLE";
    const stationName = formData.get("stationName") as string | null;
    const batteryLevel = formData.get("batteryLevel") as string | null;
    const batteryTime = formData.get("batteryTime") as string | null;
    const currentLocationLat = formData.get("currentLocationLat")
      ? parseFloat(formData.get("currentLocationLat") as string)
      : null;
    const currentLocationLng = formData.get("currentLocationLng")
      ? parseFloat(formData.get("currentLocationLng") as string)
      : null;

    const specsRaw = formData.get("specs") as string;
    const specs = specsRaw ? JSON.parse(specsRaw) : [];

    const photo = formData.get("photo") as File | null;
    const photoUrl = photo ? await uploadImageToSupabase(photo, "bikes") : null;

    const bike = await prisma.bike.create({
      data: {
        name,
        stationId,
        status,
        currentLocationLat,
        currentLocationLng,
        stationName,
        batteryLevel,
        batteryTime,
        photo: photoUrl as any,
        specs: {
          createMany: { data: specs },
        },
      },
      include: { station: true, specs: true },
    });

    revalidatePath("/dashboard/bikes");
    return bike;
  } catch (error) {
    console.error("❌ Error creating bike:", error);
    throw new Error("Failed to create bike");
  }
}

// ✅ Update bike (with optional photo re-upload)
export async function updateBike(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const stationId = formData.get("stationId") as string;
    const status = formData.get("status") as BikeStatus;
    const photoFile = formData.get("photo") as File | null;
    const specsRaw = formData.get("specs") as string | null;

    const oldBike = await prisma.bike.findUnique({ where: { id } });

    let specs: { icon: string; label: string; value: string }[] = [];
    if (specsRaw) {
      try {
        specs = JSON.parse(specsRaw);
      } catch (e) {
        console.error("Failed to parse specs JSON:", e);
      }
    }

    let photoUrl: string | null = oldBike?.photo || null;
    if (photoFile && photoFile.size > 0) {
      // Delete old photo
      if (oldBike?.photo) await deleteSupabaseFile(oldBike.photo);
      // Upload new one
      photoUrl = await uploadImageToSupabase(photoFile, "bikes");
    }

    const updatedBike = await prisma.bike.update({
      where: { id },
      data: {
        name,
        stationId,
        status,
        photo: photoUrl as any,
        specs: {
          deleteMany: {},
          create: specs,
        },
      },
      include: { station: true, specs: true },
    });

    revalidatePath("/dashboard/bikes");
    return { success: true, bike: updatedBike };
  } catch (error) {
    console.error("❌ Error updating bike:", error);
    return { success: false, error: "Failed to update bike." };
  }
}

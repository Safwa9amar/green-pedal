// app/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
import { uploadImage } from "@/lib/uploadImage";
import { BikeStation } from "@prisma/client";
import { revalidatePath } from "next/cache";

const io = getIO();

// ✅ Get all stations
export async function getAllStations() {
  return await prisma.bikeStation.findMany({
    include: {
      bikes: true,
    },
  });
}

//  Create station + notify via socket

export async function createStation(formData: FormData) {
  try {
    // Extract fields
    const name = formData.get("name") as string;
    const capacity = Number(formData.get("capacity"));
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));
    const photo = formData.get("photo") as File | null;
    console.log(photo);

    // ✅ Upload photo if provided
    let imageUrl: string | null = null;
    if (photo) {
      imageUrl = await uploadImage(photo, "stations"); // upload to Cloudinary, local, etc.
    }

    // ✅ Create station in DB
    const station = await prisma.bikeStation.create({
      data: {
        name,
        capacity,
        latitude,
        longitude,
        photoUrl: imageUrl,
      },
    });
    await prisma.file.create({
      data: {
        mimeType: photo?.type.replace("/", "_").toUpperCase() as any,
        name: photo?.name as any,
        size: photo?.size as any,
        url: imageUrl as any,
      },
    });

    //  Notify all connected clients
    io.emit("stations:update", await getAllStations());

    return station;
  } catch (error) {
    console.error("❌ Error creating station:", error);
    throw new Error("Failed to create station");
  }
}

// ✅ Delete station + notify via socket
export async function deleteStation(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Station ID is required");

  await prisma.bikeStation.delete({
    where: { id },
  });

  // TODO : delete also photo of station
  io.emit("stations:update", await getAllStations());

  // Revalidate the stations page
  revalidatePath("/dashboard/stations");
}

// ✅ Get station by ID
export async function getStationByID(id: string) {
  return await prisma.bikeStation.findUnique({
    where: { id },
    include: { bikes: true },
  });
}

// ✅ Update station (optional)
export async function updateStation(id: string, data: Partial<BikeStation>) {
  const station = await prisma.bikeStation.update({
    where: { id },
    data,
  });

  io.emit("stations:update", await getAllStations());

  return station;
}

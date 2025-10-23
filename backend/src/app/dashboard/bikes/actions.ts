"use server";
import { Bike, BikeStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { getIO } from "@/lib/socket";
import { getAllStations } from "../stations/actions";
import { uploadImage } from "@/lib/uploadImage";
// const io = getIO();

export async function getALlBikes(): Promise<Bike[]> {
  let bikes = await prisma.bike.findMany({
    include: {
      specs: true,
    },
  });
  return bikes;
}

export async function SetBikeToMaintenance(formData: FormData) {
  let id = formData.get("id") as string;

  if (!id) throw new Error("Station ID is required");
  let updatedBike = await prisma.bike.update({
    where: { id },
    data: {
      status: "MAINTENANCE",
    },
    include: {
      station: true,
      specs: true,
    },
  });
  // io.emit("stations:update", await getAllStations()); // broadcast new stations list
  // io.emit("bike:updated", updatedBike);

  revalidatePath("/dashboard/bikes");
}

export async function SetBikeToAvailable(formData: FormData) {
  let id = formData.get("id") as string;

  if (!id) throw new Error("Station ID is required");
  let updatedBike = await prisma.bike.update({
    where: { id },
    data: {
      status: "AVAILABLE",
    },
    include: {
      station: true,
      specs: true,
    },
  });
  // io.emit("stations:update", await getAllStations()); // broadcast new stations list
  // io.emit("bike:updated", updatedBike);

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
  // io.emit("stations:update", await getAllStations()); // broadcast new stations list
  revalidatePath("/dashboard/bikes");
}

export type BikeFormValues = {
  name: string;
  type: string;
  photo: File;
  stationId: string;
  status?: BikeStatus;
  currentLocationLat?: number | null;
  currentLocationLng?: number | null;
  stationName?: string;
  batteryLevel: string;
  batteryTime: string;
  specs: {
    icon: string;
    label: string;
    value: string;
  }[];
};

export async function createBike(formData: FormData) {
  try {
    // ✅ Extract basic fields
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

    // ✅ Parse specs JSON (comes as stringified JSON from client)
    const specsRaw = formData.get("specs") as string;
    const specs =
      specsRaw && specsRaw.trim() !== "" ? JSON.parse(specsRaw) : [];

    // ✅ Upload photo if provided
    let photoUrl: string | null = null;
    const photo = formData.get("photo") as File;
    photoUrl = await uploadImage(photo, "bikes");
    // photo is requied so fix this
    // ✅ Create bike in DB
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
          createMany: {
            data: specs,
          },
        },
      },
      include: { station: true, specs: true },
    });

    // ✅ Notify all clients
    // io.emit("stations:update", await getAllStations());

    // ✅ Revalidate dashboard
    revalidatePath("/dashboard/bikes");

    return bike;
  } catch (error) {
    console.error("❌ Error creating bike:", error);
    throw new Error("Failed to create bike");
  }
}

export async function updateBike(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const stationId = formData.get("stationId") as string;
    const status = formData.get("status") as string;
    const photoFile = formData.get("photo") as File | null;
    const specsRaw = formData.get("specs") as string | null;

    let specs: { icon: string; label: string; value: string }[] = [];
    if (specsRaw) {
      try {
        specs = JSON.parse(specsRaw);
      } catch (e) {
        console.error("❌ Failed to parse specs JSON:", e);
      }
    }

    let photoUrl: string | null = null;
    const photo = formData.get("photo") as File;
    photoUrl = await uploadImage(photo, "bikes");

    // ✅ Update the bike and its related specs atomically
    const updatedBike = await prisma.bike.update({
      where: { id },
      data: {
        name,
        stationId,
        status: status as any,
        ...(photoUrl ? { photo: photoUrl } : {}),

        // 🧩 Sync specs: delete old ones, then recreate
        specs: {
          deleteMany: {}, // remove all old specs
          create: specs.map((spec) => ({
            icon: spec.icon,
            label: spec.label,
            value: spec.value,
          })),
        },
      },
      include: {
        station: true,
        specs: true,
      },
    });

    // ✅ Notify clients via socket
    // io.emit("stations:update", await getAllStations());
    // io.emit("bike:updated", updatedBike);

    // ✅ Revalidate cache
    revalidatePath("/dashboard/bikes");

    return { success: true, bike: updatedBike };
  } catch (error) {
    console.error("❌ Error updating bike:", error);
    return { success: false, error: "Failed to update bike." };
  }
}

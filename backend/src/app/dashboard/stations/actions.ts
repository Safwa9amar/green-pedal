// app/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
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

// ✅ Create station + notify via socket
export async function createStation(data: Omit<BikeStation, "id">) {
  const station = await prisma.bikeStation.create({ data });

  io.emit("stations:update", await getAllStations()); // broadcast new stations list

  return station;
}

// ✅ Delete station + notify via socket
export async function deleteStation(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Station ID is required");

  await prisma.bikeStation.delete({
    where: { id },
  });

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

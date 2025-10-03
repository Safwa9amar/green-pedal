// app/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { BikeStation } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllStations() {
  return await prisma.bikeStation.findMany({
    include: {
      bikes: true,
    },
  });
}

export async function createStation(data: BikeStation) {
  return prisma.bikeStation.create({ data });
}

// Delete station (form version)
export async function deleteStation(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) throw new Error("Station ID is required");

  await prisma.bikeStation.delete({
    where: { id },
  });

  // Revalidate the stations page after deletion
  revalidatePath("/dashboard/stations");
}

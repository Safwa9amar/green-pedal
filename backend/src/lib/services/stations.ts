import prisma from "@/lib/db";
import { BikeStation } from "@prisma/client";

export async function getStationsData(): Promise<BikeStation[]> {
  return prisma.bikeStation.findMany();
}

import prisma from "@/lib/db";
import { Bike } from "@prisma/client";

export async function getBikesData(): Promise<Bike[]> {
  const bikes = await prisma.bike.findMany({
    include: {
      station: true,
    },
  });
  return bikes.map((bike) => ({
    ...bike,
    stationName: bike.station?.name || "N/A",
  }));
}

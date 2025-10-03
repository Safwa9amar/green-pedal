import { Bike } from "@prisma/client";
import prisma from "@/lib/prisma";
export async function getBikesData(): Promise<Bike[]> {
  // This is a mock implementation.
  // In a real application, you would fetch this data from a database.
  let bikes = await prisma.bike.findMany();
  return bikes;
}

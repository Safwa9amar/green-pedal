import { Bike } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getALlBikes(): Promise<Bike[]> {
  let bikes = await prisma.bike.findMany();
  return bikes;
}

import { Bike, Rental } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getActiveRentals(): Promise<Rental[]> {
  let bikes = await prisma.rental.findMany({
    where: {
      status: "ACTIVE",
    },
  });
  return bikes;
}

export async function getCompletedRentals(): Promise<Rental[]> {
  let bikes = await prisma.rental.findMany({
    where: {
      status: "COMPLETED",
    },
  });
  return bikes;
}

import { Bike, Rental } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getActiveRentals(): Promise<Rental[]> {
  let rentals = await prisma.rental.findMany({
    where: {
      status: "ACTIVE",
    },
  });
  return rentals;
}

export async function getCompletedRentals(): Promise<Rental[]> {
  let rentals = await prisma.rental.findMany({
    where: {
      status: "COMPLETED",
    },
  });
  return rentals;
}

export async function getAllRentals(): Promise<Rental[]> {
  let rentals = await prisma.rental.findMany({
    include: {
      bike: true,
      user: true,
    },
  });
  return rentals;
}

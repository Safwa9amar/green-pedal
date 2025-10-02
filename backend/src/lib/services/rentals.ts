import prisma from "@/lib/db";
import { Rental } from "@prisma/client";

export async function getRentalsData(): Promise<Rental[]> {
  const rentals = await prisma.rental.findMany({
    include: {
      user: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });
  return rentals.map((rental) => ({
    ...rental,
    userName: rental.user.name,
  }));
}

export async function getRecentRentalsData(): Promise<Rental[]> {
  const rentals = await getRentalsData();
  return rentals.slice(0, 5);
}

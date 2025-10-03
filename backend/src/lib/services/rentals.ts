import { Rental } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getRentalsData(): Promise<Rental[]> {
  // This is a mock implementation.
  // In a real application, you would fetch this data from a database.
  return await prisma.rental.findMany();
}

export async function getRecentRentalsData(): Promise<Rental[]> {
  const rentals = await getRentalsData();
  return rentals.slice(0, 5);
}

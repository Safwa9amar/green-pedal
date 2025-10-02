import prisma from "@/lib/db";
import type { Stat } from "@/lib/types";

export async function getStatsData(): Promise<{}[]> {
  try {
    const totalStations = await prisma.bikeStation.count();
    const totalBikes = await prisma.bike.count();
    const activeRentals = await prisma.rental.count({
      where: { status: "ACTIVE" },
    });
    const completedRentals = await prisma.rental.findMany({
      where: { status: "COMPLETED", totalCost: { not: null } },
    });

    const totalRevenue = completedRentals.reduce(
      (acc, rental) => acc + (rental.totalCost ?? 0),
      0
    );

    const stats: {}[] = [
      {
        title: "Total Stations",
        value: totalStations.toString(),
        icon: "MapPin",
        change: "+2 since last month",
      },
      {
        title: "Total Bikes",
        value: totalBikes.toString(),
        icon: "Bike",
        change: "+15 since last month",
      },
      {
        title: "Active Rentals",
        value: activeRentals.toString(),
        icon: "Activity",
        change: "-3 from yesterday",
      },
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        icon: "DollarSign",
        change: "+12.5% since last month",
      },
    ];

    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error("Failed to fetch stats data.");
  }
}

import { getAllStations } from "@/app/dashboard/stations/actions";
import { getALlBikes } from "@/app/dashboard/bikes/actions";
import {
  getActiveRentals,
  getCompletedRentals,
} from "@/app/dashboard/rentals/actions";

export async function getStatsData(): Promise<{}[]> {
  try {
    const totalStations = (await getAllStations()).length;
    const totalBikes = (await getALlBikes()).length;
    const activeRentals = (await getActiveRentals()).length;
    const completedRentals = await getCompletedRentals();

    const totalRevenue = completedRentals.reduce(
      (acc, rental) => acc + (rental.totalCost ?? 0),
      0
    );

    const stats = [
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

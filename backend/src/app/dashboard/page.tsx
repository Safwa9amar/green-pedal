import StatCard from "@/components/dashboard/StatCard";
import { Bike, MapPin, Activity, DollarSign } from "lucide-react";
import type { Stat } from "@/lib/types";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentRentals from "@/components/dashboard/RecentRentals";
import { getStatsData } from "@/lib/services/stats";
const iconMap: { [key: string]: React.ElementType } = {
  MapPin,
  Bike,
  Activity,
  DollarSign,
};

export default async function DashboardPage() {
  const statsData = await getStatsData();

  const stats: Stat[] = statsData.map((stat) => ({
    ...stat,
    icon: iconMap[stat.icon],
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <RecentRentals />
        </div>
      </div>
    </div>
  );
}

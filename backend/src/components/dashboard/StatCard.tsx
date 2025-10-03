import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stat } from "@/lib/types";

export default async function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <stat.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{stat.value}</div>
        {stat.change && (
          <p className="text-xs text-muted-foreground">{stat.change}</p>
        )}
      </CardContent>
    </Card>
  );
}

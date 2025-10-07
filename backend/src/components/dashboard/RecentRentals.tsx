import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getRecentRentalsData } from "@/app/dashboard/actions";

export default async function RecentRentals() {
  const recentRentals = await getRecentRentalsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Rentals</CardTitle>
        <CardDescription>
          An overview of the latest rental activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Bike ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>
                  <div className="font-medium">{rental.userName}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {rental.userId}
                  </div>
                </TableCell>
                <TableCell>{rental.bikeId}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      rental.status === "ACTIVE" ? "destructive" : "secondary"
                    }
                  >
                    {rental.status.toLowerCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import PageHeader from "@/components/shared/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getAllRentals } from "./actions";
import { calculateOngoingRideCost } from "@/lib/calculateRideCost";

export default async function RentalsPage() {
  const rentals = await getAllRentals();

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return `${formatDistanceToNow(new Date(date))} ago`;
  };

  return (
    <>
      <PageHeader title="Rentals" />
      <Card>
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
          <CardDescription>
            A log of all bike rentals in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Bike ID</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">
                    {rental?.user?.name}
                  </TableCell>
                  <TableCell>{rental.bikeId}</TableCell>
                  <TableCell>{rental.startTime.toUTCString()}</TableCell>
                  <TableCell>
                    {
                      calculateOngoingRideCost(rental.startTime)
                        .formattedDuration
                    }
                  </TableCell>
                  <TableCell>
                    {rental.endTime
                      ? formatDate(rental.endTime)
                      : "In Progress"}
                  </TableCell>
                  <TableCell>
                    {calculateOngoingRideCost(rental.startTime).cost}
                  </TableCell>
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
    </>
  );
}

import PageHeader from "@/components/shared/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getRentalsData } from "@/lib/services/rentals";

export default async function RentalsPage() {
  const rentals = await getRentalsData();

  const formatCost = (cost: number | null) => {
    if (cost === null) return "N/A";
    return `$${cost.toFixed(2)}`;
  };
  
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
          <CardDescription>A log of all bike rentals in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Bike ID</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.userName}</TableCell>
                  <TableCell>{rental.bikeId}</TableCell>
                  <TableCell>{formatDate(rental.startTime)}</TableCell>
                  <TableCell>{rental.endTime ? formatDate(rental.endTime) : 'In Progress'}</TableCell>
                  <TableCell>{formatCost(rental.cost)}</TableCell>
                  <TableCell>
                    <Badge variant={rental.status === 'ACTIVE' ? 'destructive' : 'secondary'}>
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

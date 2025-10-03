import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddStation from "@/components/forms/AddStation";
import { deleteStation, getAllStations } from "./actions";

export default async function StationsPage() {
  const stations = await getAllStations();

  return (
    <>
      <PageHeader title="Stations">
        <AddStation />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Station List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Bikes Available</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>
                    <a
                      target="_blank"
                      className="flex gap-5"
                      href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
                    >
                      <MapPin size={20} />
                      Open in google maps
                    </a>
                  </TableCell>
                  <TableCell>{station.capacity}</TableCell>
                  <TableCell>{station.bikes.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <form action={deleteStation}>
                          <input type="hidden" name="id" value={station.id} />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full text-left">
                              Delete
                            </button>
                          </DropdownMenuItem>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "qrcode";
import BikeQRCode from "@/lib/BikeQRCode";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import { Bike, BikeStation } from "@prisma/client";
import {
  deleteBike,
  SetBikeToAvailable,
  SetBikeToMaintenance,
} from "./actions";
import { EditBikeDialog } from "@/components/forms/EditBike";

export default function BikesTable({
  bikes,
  stations,
}: {
  bikes: Bike[];
  stations: BikeStation[];
}) {
  const [selectedBike, setSelectedBike] = useState<any | null>(null);

  const getStatusVariant = (
    status: "AVAILABLE" | "IN_USE" | "MAINTENANCE"
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "AVAILABLE":
        return "default";
      case "IN_USE":
        return "secondary";
      case "MAINTENANCE":
        return "destructive";
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bike Name</TableHead>
            <TableHead>Current Station</TableHead>
            <TableHead>Battery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bikes.map((bike) => (
            <TableRow key={bike.id}>
              {/* ✅ Bike ID clickable */}
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    className="w-10 h-10 rounded-full"
                    src={bike.photo}
                    alt="Colm Tuite"
                  />
                </Avatar>
                <p>{bike.name}</p>
              </TableCell>
              <TableCell>{bike.station.name || "N/A"}</TableCell>
              <TableCell>{bike.batteryLevel ?? "N/A"}%</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(bike.status)}>
                  {bike.status.toLowerCase().replace("_", "-")}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <EditBikeDialog bike={bike} stations={stations} />
                    <form action={SetBikeToMaintenance}>
                      <input type="hidden" name="id" value={bike.id} />
                      <DropdownMenuItem asChild>
                        <button type="submit" className="w-full text-left">
                          Set to Maintenance
                        </button>
                      </DropdownMenuItem>
                    </form>
                    <form action={SetBikeToAvailable}>
                      <input type="hidden" name="id" value={bike.id} />
                      <DropdownMenuItem asChild>
                        <button type="submit" className="w-full text-left">
                          Set to available
                        </button>
                      </DropdownMenuItem>
                    </form>
                    <DropdownMenuItem onClick={() => setSelectedBike(bike)}>
                      Show QR code
                    </DropdownMenuItem>
                    <form action={deleteBike}>
                      <input type="hidden" name="id" value={bike.id} />
                      <DropdownMenuItem>
                        <button
                          type="submit"
                          className="flex gap-2 items-center "
                        >
                          <Trash2Icon size={20} />
                          Delete Bike
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

      {/* ✅ QR Code Dialog */}
      <Dialog open={!!selectedBike} onOpenChange={() => setSelectedBike(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bike QR Code</DialogTitle>
          </DialogHeader>
          {selectedBike && (
            <div className="flex flex-col items-center gap-4">
              <p className="font-mono text-sm">Bike ID: {selectedBike.id}</p>
              <BikeQRCode bikeId={selectedBike.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { BikeFormValues, createBike } from "@/app/dashboard/bikes/actions";
import { Bike, BikeStation, BikeStatus } from "@prisma/client";

const bikeStatuses = ["AVAILABLE", "IN_USE", "MAINTENANCE"];

export function AddBike({ stations }: { stations: BikeStation[] }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BikeFormValues>({
    defaultValues: {
      name: "",
      stationId: "",
      status: "AVAILABLE",
      currentLocationLat: 0,
      currentLocationLng: 0,
      stationName: "",
      batteryLevel: "",
    },
  });

  const onSubmit = async (values: BikeFormValues) => {
    const payload = {
      ...values,
      currentLocationLat: values.currentLocationLat
        ? values.currentLocationLat
        : null,
      currentLocationLng: values.currentLocationLng
        ? values.currentLocationLng
        : null,
      photo: values.photo?.[0], // take only first file
    };

    await createBike(payload);
  };

  const selectedStationId = watch("stationId");
  const selectedStation = stations.find((s) => s.id === selectedStationId);

  // Auto-fill lat/lng + stationName when station changes
  if (selectedStation) {
    setValue("currentLocationLat", selectedStation.latitude);
    setValue("currentLocationLng", selectedStation.longitude);
    setValue("stationName", selectedStation.name);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Add Bike
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Bike</DialogTitle>
          <DialogDescription>
            Fill in the details for the new bike.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Bike name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photo" className="text-right">
              Bike name
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Bike name is required" })}
              className="col-span-3"
            />
            {errors.name && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>
          {/* Bike Photo */}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photo" className="text-right">
              Bike photo
            </Label>
            <Input
              type="file"
              accept="image/*"
              id="photo"
              {...register("photo", { required: "Photo is required" })}
              className="col-span-3"
            />
            {errors.photo && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.photo.message?.toString()}
              </p>
            )}
          </div>

          {/* Station */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stationId" className="text-right">
              Initial Station
            </Label>
            <Select
              {...register("stationId", { required: "station is required" })}
              onValueChange={(value) =>
                setValue("stationId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stationId && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.stationId.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("status", value as BikeStatus, {
                  shouldValidate: true,
                })
              }
              defaultValue="AVAILABLE"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {bikeStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Latitude */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentLocationLat" className="text-right">
              Latitude
            </Label>
            <Input
              id="currentLocationLat"
              {...register("currentLocationLat")}
              className="col-span-3"
              readOnly
            />
          </div>

          {/* Longitude */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentLocationLng" className="text-right">
              Longitude
            </Label>
            <Input
              id="currentLocationLng"
              {...register("currentLocationLng")}
              className="col-span-3"
              readOnly
            />
          </div>

          {/* Station Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stationName" className="text-right">
              Station Name
            </Label>
            <Input
              id="stationName"
              {...register("stationName")}
              className="col-span-3"
              readOnly
            />
          </div>

          {/* Battery Level */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="batteryLevel" className="text-right">
              Battery Level
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              id="batteryLevel"
              placeholder="e.g. 85%"
              {...register("batteryLevel")}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save Bike</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

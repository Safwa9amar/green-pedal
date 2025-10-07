"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import {
  PlusCircle,
  Trash2,
  Gauge,
  Battery,
  Zap,
  Bike,
  Circle,
  Wrench,
  MapPin,
} from "lucide-react";
import { BikeStation, BikeStatus } from "@prisma/client";
import { toast } from "react-toastify";
import { createBike, BikeFormValues } from "@/app/dashboard/bikes/actions";
import { getStationByID } from "@/app/dashboard/stations/actions";

const bikeStatuses = ["AVAILABLE", "IN_USE", "MAINTENANCE"];

// 👇 Available icons for specs
const iconOptions = [
  { name: "gauge", icon: Gauge },
  { name: "battery", icon: Battery },
  { name: "zap", icon: Zap },
  { name: "bike", icon: Bike },
  { name: "circle", icon: Circle },
  { name: "wrench", icon: Wrench },
  { name: "map-pin", icon: MapPin },
];

export function AddBike({ stations }: { stations: BikeStation[] }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BikeFormValues>({
    defaultValues: {
      name: "",
      stationId: "",
      status: "AVAILABLE",
      batteryLevel: "",
      specs: [{ label: "Max Speed", value: "", icon: "gauge" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specs",
  });

  const selectedStationId = watch("stationId");
  const selectedStation = stations.find((s) => s.id === selectedStationId);

  if (selectedStation) {
    setValue("currentLocationLat", selectedStation.latitude);
    setValue("currentLocationLng", selectedStation.longitude);
    setValue("stationName", selectedStation.name);
  }

  const onSubmit = async (values: BikeFormValues) => {
    try {
      const selectedStation = await getStationByID(values.stationId);
      if (
        selectedStation &&
        selectedStation?.bikes.length + 1 > selectedStation?.capacity
      ) {
        return toast.warn("Station is full — choose another.", {
          position: "bottom-left",
          toastId: "fullStation",
        });
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "photo" && key !== "specs") {
          formData.append(key, String(value ?? ""));
        }
      });
      if (values.photo?.[0]) formData.append("photo", values.photo[0]);
      formData.append("specs", JSON.stringify(values.specs));

      await createBike(formData);
      toast.success("✅ Bike added successfully", {
        position: "bottom-left",
        toastId: "addBike",
      });
      reset();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error adding bike", { position: "bottom-left" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Bike
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add New Bike
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the new bike.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Info Section */}
          <div className="border border-border/30 rounded-xl p-4 bg-muted/10 space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              General Information
            </h3>

            {/* Bike name */}
            <div>
              <Label htmlFor="name">Bike Name</Label>
              <Input
                id="name"
                placeholder="e.g. Green Pedal Bike"
                {...register("name", { required: "Bike name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Photo */}
            <div>
              <Label htmlFor="photo">Bike Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                {...register("photo", { required: "Photo is required" })}
              />
              {errors.photo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.photo.message}
                </p>
              )}
            </div>

            {/* Station & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Station</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("stationId", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
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
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("status", value as BikeStatus)
                  }
                  defaultValue="AVAILABLE"
                >
                  <SelectTrigger>
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
            </div>

            {/* Battery Level */}
            <div>
              <Label htmlFor="batteryLevel">Battery Level (%)</Label>
              <Input
                type="number"
                id="batteryLevel"
                min={0}
                max={100}
                placeholder="e.g. 85"
                {...register("batteryLevel")}
              />
            </div>
          </div>

          {/* Bike Specs Section */}
          <div className="border border-border/30 rounded-xl p-4 bg-muted/10 space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Bike Specifications
            </h3>

            {fields.map((field, index) => {
              const SelectedIcon =
                iconOptions.find(
                  (opt) => opt.name === watch(`specs.${index}.icon`)
                )?.icon || Circle;

              return (
                <div key={field.id} className="flex items-center gap-2">
                  {/* Icon Picker */}
                  <Select
                    onValueChange={(value) =>
                      setValue(`specs.${index}.icon`, value)
                    }
                    defaultValue={field.icon}
                  >
                    <SelectTrigger className="w-[100px] flex items-center justify-center">
                      <SelectedIcon className="w-4 h-4 mr-1" />
                      <SelectValue placeholder="Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(({ name, icon: Icon }) => (
                        <SelectItem key={name} value={name}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Label */}
                  <Input
                    placeholder="Label"
                    {...register(`specs.${index}.label` as const, {
                      required: true,
                    })}
                    className="w-1/3"
                  />

                  {/* Value */}
                  <Input
                    placeholder="Value"
                    {...register(`specs.${index}.value` as const, {
                      required: true,
                    })}
                    className="w-1/2"
                  />

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: "", value: "", icon: "circle" })}
            >
              + Add Spec
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Bike"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

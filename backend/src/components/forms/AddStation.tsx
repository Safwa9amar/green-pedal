"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { StationFormData } from "@/lib/types";
import { toast } from "react-toastify";
import MapPicker from "./MapPicker";
import { useRouter } from "next/navigation";
import { createStation } from "@/app/dashboard/stations/actions";
export default function AddStation() {
  const { refresh } = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StationFormData>();
  let { latitude, longitude } = watch();
  const onSubmit = async (data: StationFormData) => {
    if (!latitude && !longitude) {
      return toast.error("Please select the station on the map", {
        toastId: "maptoast",
      });
    }
    try {
      await createStation(data);
      // Reset form on success
      reset();
      toast.success("Station added successfully!", {
        position: "bottom-left",
      });
      refresh();
    } catch (err) {
      toast.error("Error when create a new station try again", {
        position: "bottom-left",
      });
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Add Station
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Station</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new bike station.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              className="col-span-3"
            />
            {errors.name && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">
              Capacity
            </Label>
            <Input
              id="capacity"
              type="number"
              {...register("capacity", {
                required: "Capacity is required",
                min: { value: 1, message: "Must be at least 1" },
                valueAsNumber: true,
              })}
              className="col-span-3"
            />
            {errors.capacity && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <MapPicker
              onSelect={(lat, lng) => {
                setValue("latitude", lat);
                setValue("longitude", lng);
              }}
            />
            {errors.latitude && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.latitude.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Station"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

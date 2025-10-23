"use client";
import React, { useState } from "react";
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
import { PlusCircle, ImageIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { StationFormData } from "@/lib/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createStation } from "@/app/dashboard/stations/actions";
import dynamic from "next/dynamic";

// ✅ Proper dynamic import for MapPicker (client-only)
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

export default function AddStation() {
  const { refresh } = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StationFormData>();

  const { latitude, longitude } = watch();

  const onSubmit = async (data: StationFormData) => {
    if (!latitude || !longitude) {
      return toast.error("Please select the station on the map", {
        toastId: "maptoast",
      });
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("capacity", data.capacity.toString());
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      if (imageFile) {
        formData.append("photo", imageFile);
      }

      await createStation(formData);

      reset();
      setImageFile(null);
      toast.success("Station added successfully!", { position: "bottom-left" });
      refresh();
    } catch (err) {
      toast.error("Error creating station, please try again", {
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

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Name */}
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

          {/* Capacity */}
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

          {/* Image Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Photo
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
              {imageFile && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <ImageIcon className="h-4 w-4" />
                  {imageFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div>
            <MapPicker
              onSelect={(lat, lng) => {
                setValue("latitude", lat);
                setValue("longitude", lng);
              }}
            />
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

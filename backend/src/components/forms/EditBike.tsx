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
import { Edit } from "lucide-react";
import { updateBike } from "@/app/dashboard/bikes/actions";

type BikeFormValues = {
  id: string;
  name: string;
  stationId: string;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  photo?: FileList;
};

export function EditBikeDialog({
  bike,
  stations,
}: {
  bike: {
    id: string;
    name: string;
    stationId: string;
    status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
    photo: string;
  };
  stations: { id: string; name: string }[];
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BikeFormValues>({
    defaultValues: {
      id: bike.id,
      name: bike.name,
      stationId: bike.stationId,
      status: bike.status,
    },
  });

  const onSubmit = async (values: BikeFormValues) => {
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("stationId", values.stationId);
    formData.append("status", values.status);
    if (values.photo && values.photo.length > 0) {
      formData.append("photo", values.photo[0]);
    }

    await updateBike(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bike</DialogTitle>
          <DialogDescription>Update bike details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Bike name is required" })}
              className="col-span-3"
            />
            {errors.name && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Station */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stationId" className="text-right">
              Station
            </Label>
            <Select
              onValueChange={(value) => setValue("stationId", value)}
              defaultValue={bike.stationId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("status", value as BikeFormValues["status"])
              }
              defaultValue={bike.status}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="IN_USE">In Use</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Photo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photo" className="text-right">
              Photo
            </Label>
            <Input
              type="file"
              accept="image/*"
              id="photo"
              {...register("photo")}
              className="col-span-3"
            />
            {bike.photo && (
              <div className="col-span-4 flex justify-center">
                <img
                  src={bike.photo}
                  alt="Current Bike"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

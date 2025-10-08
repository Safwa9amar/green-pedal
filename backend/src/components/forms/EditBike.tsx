"use client";

import { useState } from "react";
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
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { updateBike } from "@/app/dashboard/bikes/actions";
import { toast } from "react-toastify";
import Image from "next/image";

type Spec = {
  icon: string;
  label: string;
  value: string;
};

type BikeFormValues = {
  id: string;
  name: string;
  stationId: string;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  photo?: FileList;
  specs?: Spec[];
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
    specs?: Spec[];
  };
  stations: { id: string; name: string }[];
}) {
  const [preview, setPreview] = useState<string | null>(bike.photo);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BikeFormValues>({
    defaultValues: {
      id: bike.id,
      name: bike.name,
      stationId: bike.stationId,
      status: bike.status,
      specs: bike.specs || [{ icon: "", label: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specs",
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
    formData.append("specs", JSON.stringify(values.specs || []));

    try {
      await updateBike(formData);
      toast.success("🚲 Bike updated successfully!", {
        position: "bottom-left",
      });
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update bike. Try again.", {
        position: "bottom-left",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[720px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Bike</DialogTitle>
          <DialogDescription>
            Update bike details and specifications below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Bike name --- */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Bike name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          {/* --- Station --- */}
          <div>
            <Label>Station</Label>
            <Select
              onValueChange={(value) => setValue("stationId", value)}
              defaultValue={bike.stationId}
            >
              <SelectTrigger>
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
            {errors.stationId && (
              <p className="text-sm text-red-500">{errors.stationId.message}</p>
            )}
          </div>
          {/* --- Status --- */}
          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(value) =>
                setValue("status", value as BikeFormValues["status"])
              }
              defaultValue={bike.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="IN_USE">In Use</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* --- Photo --- */}
          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              type="file"
              accept="image/*"
              id="photo"
              {...register("photo")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={preview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-md object-cover border"
                />
              </div>
            )}
          </div>

          {/* --- Specs --- */}
          <div className="space-y-3">
            <Label>Bike Specifications</Label>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 border p-2 rounded-md"
              >
                <Input
                  placeholder="Icon (e.g., ⚡)"
                  {...register(`specs.${index}.icon` as const)}
                  className="w-16 text-center"
                />
                <Input
                  placeholder="Label (e.g., Battery)"
                  {...register(`specs.${index}.label` as const, {
                    required: "Label required",
                  })}
                />

                <Input
                  placeholder="Value (e.g., 90%)"
                  {...register(`specs.${index}.value` as const, {
                    required: "Value required",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => append({ icon: "", label: "", value: "" })}
            >
              <PlusCircle className="h-4 w-4" /> Add Spec
            </Button>
          </div>
          {/* --- Submit --- */}
          <DialogFooter>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

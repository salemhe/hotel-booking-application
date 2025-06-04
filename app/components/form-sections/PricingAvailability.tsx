"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch"
import { Label } from "@/app/components/ui/label";

const schema = z.object({
  price: z.number().min(0, "Price must be a positive number"),
  discountPrice: z
    .number()
    .min(0, "Discount price must be a positive number")
    .optional(),
  preparationTime: z.string().min(1, "Preparation time is required"),
  availabilityStatus: z.literal(true, { errorMap: () => ({ message: "Availability status must be true" }) }),
});

type PricingAvailabilityProps = {
  onNext: (data: z.infer<typeof schema>) => void;
  onBack: () => void;
  initialData: Partial<z.infer<typeof schema>>;
};

export function PricingAvailability({
  onNext,
  onBack,
  initialData,
}: PricingAvailabilityProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      price: initialData.price ?? 0, // Ensure it's always a number
      discountPrice: initialData.discountPrice ?? 0, // Optional, default to 0
      preparationTime: initialData.preparationTime ?? "", // Ensure it's always a string
      availabilityStatus: initialData.availabilityStatus ?? true,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="price">Price (₦)</Label>
        <Input
          id="price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          placeholder="Enter original price"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="discountPrice">Discount Price (₦) (Optional)</Label>
        <Input
          id="discountPrice"
          type="number"
          {...register("discountPrice", { valueAsNumber: true })}
          placeholder="Enter discount price"
        />
        {errors.discountPrice && (
          <p className="text-red-500 text-sm mt-1">
            {errors.discountPrice.message}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          name="availabilityStatus"
          control={control}
          render={({ field }) => (
            <Switch id="availabilityStatus" onCheckedChange={field.onChange} checked={field.value} />
          )}
        />
        <Label htmlFor="availabilityStatus">Available</Label>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-gray-700">Menu must be Available</p>
      </div>
      <div>
        <Label htmlFor="preparationTime">Preparation Time</Label>
        <Controller
          name="preparationTime"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select preparation time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hr+</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.preparationTime && (
          <p className="text-red-500 text-sm mt-1">
            {errors.preparationTime.message}
          </p>
        )}
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

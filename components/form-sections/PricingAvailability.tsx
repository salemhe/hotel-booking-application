"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";

const schema = z.object({
  price: z.number().min(0, "Price must be a positive number"),
  discountPrice: z
    .number()
    .min(0, "Discount price must be a positive number")
    .optional(),
    availabilityStatus: z.boolean(),
  preparationTime: z.string().min(1, "Preparation time is required"),
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
      availabilityStatus: initialData.availabilityStatus ?? false,
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
        <Switch id="availabilityStatus" {...register("availabilityStatus")} />
        <Label htmlFor="availabilityStatus">Available</Label>
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
                <SelectItem value="10min">10 min</SelectItem>
                <SelectItem value="15min">15 min</SelectItem>
                <SelectItem value="30min">30 min</SelectItem>
                <SelectItem value="45min">45 min</SelectItem>
                <SelectItem value="1hr+">1 hr+</SelectItem>
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

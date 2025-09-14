"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  stockQuantity: z
    .number()
    .int()
    .min(1, "Stock quantity must be at least 1"),
  maxOrderPerCustomer: z
    .number()
    .int()
    .min(1, "Max order per customer must be at least 1"),
});

type InventoryOrderSettingsProps = {
  onSubmit: (data: z.infer<typeof schema>) => void;
  onBack: () => void;
  initialData: Partial<z.infer<typeof schema>>;
  isSubmitting: boolean;
  save: () => void;
};

export function InventoryOrderSettings({
  onSubmit,
  onBack,
  initialData,
  isSubmitting,
  save,
}: InventoryOrderSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      stockQuantity: initialData.stockQuantity ?? 0,
      maxOrderPerCustomer: initialData.maxOrderPerCustomer ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="stockQuantity">Stock Quantity</Label>
        <Input
          id="stockQuantity"
          type="number"
          {...register("stockQuantity", { valueAsNumber: true })}
        />
        {errors.stockQuantity && (
          <p className="text-red-500 text-sm mt-1">
            {errors.stockQuantity.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="maxOrderPerCustomer">Max Order per Customer</Label>
        <Input
          id="maxOrderPerCustomer"
          type="number"
          {...register("maxOrderPerCustomer", { valueAsNumber: true })}
        />
        {errors.maxOrderPerCustomer && (
          <p className="text-red-500 text-sm mt-1">
            {errors.maxOrderPerCustomer.message}
          </p>
        )}
      </div>
      <div className="flex justify-between flex-col items-center sm:flex-row gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={save}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publising..." : "Publish"}
          </Button>
        </div>
      </div>
    </form>
  );
}

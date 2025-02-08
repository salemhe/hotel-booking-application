"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const schema = z.object({
  portionSize: z.string().min(1, "Portion size is required"),
  spiceLevel: z.string().min(1, "Spice level is required"),
  addOns: z.array(z.string()).optional(),
  dietaryInfo: z.array(z.string()).optional(),
});

type PortionCustomizationProps = {
  onNext: (data: z.infer<typeof schema>) => void;
  onBack: () => void;
  initialData: Partial<z.infer<typeof schema>>;
};

export function PortionCustomization({
  onNext,
  onBack,
  initialData,
}: PortionCustomizationProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      portionSize: initialData.portionSize ?? "", // Ensure it's always a string
      spiceLevel: initialData.spiceLevel ?? "",   // Ensure it's always a string
      addOns: initialData.addOns ?? [],          // Ensure it's always an array
      dietaryInfo: initialData.dietaryInfo ?? [],// Ensure it's always an array
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="portionSize">Portion Size</Label>
        <Controller
          name="portionSize"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select portion size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extraLarge">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.portionSize && (
          <p className="text-red-500 text-sm mt-1">
            {errors.portionSize.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="spiceLevel">Spice Level</Label>
        <Controller
          name="spiceLevel"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select spice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="extraSpicy">Extra Spicy</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.spiceLevel && (
          <p className="text-red-500 text-sm mt-1">
            {errors.spiceLevel.message}
          </p>
        )}
      </div>
      <div>
        <Label>Add-ons / Extras</Label>
        <div className="space-y-2">
          <Controller
            name="addOns"
            control={control}
            render={({ field }) => (
              <>
                {["Extra Cheese", "Extra Chicken", "Extra Sauce"].map(
                  (addon) => (
                    <div key={addon} className="flex items-center space-x-2">
                      <Checkbox
                        id={addon}
                        checked={field.value?.includes(addon)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), addon]
                            : (field.value || []).filter(
                                (value: string) => value !== addon
                              );
                          field.onChange(updatedValue);
                        }}
                      />
                      <Label htmlFor={addon}>{addon}</Label>
                    </div>
                  )
                )}
              </>
            )}
          />
        </div>
      </div>
      <div>
        <Label>Dietary Information</Label>
        <div className="space-y-2">
          <Controller
            name="dietaryInfo"
            control={control}
            render={({ field }) => (
              <>
                {[
                  "Vegan",
                  "Vegetarian",
                  "Gluten-Free",
                  "Dairy-Free",
                  "Halal",
                ].map((diet) => (
                  <div key={diet} className="flex items-center space-x-2">
                    <Checkbox
                      id={diet}
                      checked={field.value?.includes(diet)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), diet]
                          : (field.value || []).filter(
                              (value: string) => value !== diet
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                    <Label htmlFor={diet}>{diet}</Label>
                  </div>
                ))}
              </>
            )}
          />
        </div>
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

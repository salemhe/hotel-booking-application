import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useContext } from "react";
import { Auths } from "@/contexts/AuthContext";

const companyType = ["Hotel", "Restaurant"];

const schema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  companyType: z.enum(["Hotel", "Restaurant"], {
    required_error: "Please your company type",
  }),
});

type Step1Props = {
  onNextStep: (data: z.infer<typeof schema>) => void;
};

const Step1 = ({ onNextStep }: Step1Props) => {
    const { formDataBusiness } = useContext(Auths);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: formDataBusiness?.companyName,
      companyType: formDataBusiness?.companyType,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    onNextStep(data);
    // Handle form submission
  };

  return (
    <form className="w-full max-w-md gap-5 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="companyName">
          Company Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="companyName"
          {...register("companyName")}
          placeholder="Enter Company Name"
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="companyType">
          Company Type <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="companyType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Company Type" />
              </SelectTrigger>
              <SelectContent>
                {companyType.map((item, i) => (
                  <SelectItem key={i} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.companyType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companyType.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};

export default Step1
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { Auths } from "@/contexts/AuthContext";

const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phone: z.string().min(1, "Phone is required"),
});

type Step1Props = {
  onNextStep: (data: z.infer<typeof schema>) => void;
};

const Step1 = ({ onNextStep }: Step1Props) => {
  const { formDataPersonal } = useContext(Auths);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: formDataPersonal?.firstName,
      lastName: formDataPersonal?.lastName,
      phone: formDataPersonal?.phone,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    onNextStep(data);
    // Handle form submission
  };

  return (
    <form
      className="w-full max-w-md gap-5 flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="firstName">
          First Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="firstName"
          {...register("firstName")}
          placeholder="Enter First Name"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="lastName">
          Last Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="lastName"
          {...register("lastName")}
          placeholder="Enter Last Name"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phone">
          Phone <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="e.g. +2341234567890"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};

export default Step1;

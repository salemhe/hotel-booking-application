"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
// import { verifyBankAccount, getBanks } from "@/lib/action"
import { getBanks, verifyBankAccount } from "@/app/lib/action";
import { BankCombobox } from "./BankComboBox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api/axios";
import { AxiosError } from "axios";
import { AuthService, AuthUser } from "@/app/lib/api/services/auth.service";

// Form validation schema
const formSchema = z.object({
  accountNumber: z
    .string()
    .length(10, { message: "Account number must be 10 digits" }),
  bankCode: z.string().min(1, { message: "Please select a bank" }),
});

interface Bank {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export default function VendorBankForm() {
  const [accountName, setAccountName] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user = AuthService.getUser() as AuthUser;
  if (!user) {
    router.push("/vendor-login")
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: user?.profile.paymentDetails.accountNumber || "",
      bankCode: user?.profile.paymentDetails.bankCode || "",
    },
  });

  const accountNumber = form.watch("accountNumber");
  const bankCode = form.watch("bankCode");

  useEffect(() => {
    async function loadBanks() {
      try {
        setIsLoadingBanks(true);
        const banksList = await getBanks();
        setBanks(banksList);
      } catch (error) {
        console.error("Failed to load banks:", error);
        setError("Failed to load banks. Please refresh the page.");
      } finally {
        setIsLoadingBanks(false);
      }
    }

    loadBanks();
  }, []);

  async function verifyAccount() {
    const values = form.getValues();

    if (!values.accountNumber || !values.bankCode) {
      form.trigger();
      return;
    }

    setIsVerifying(true);
    setError(null);
    setAccountName(null);

    try {
      const result = await verifyBankAccount(
        values.accountNumber,
        values.bankCode
      );

      if (result.status) {
        setAccountName(result.data?.account_name || null);
      } else {
        setError(result.message || "Could not verify account details");
      }
    } catch {
      setError(
        "An error occurred while verifying the account. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  }

  
 

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!accountName) {
      setError("Please verify your account details first");
      return;
    }
    setIsLoading(true);
    setError(null);
            const businessName = AuthService.getUser()?.profile.businessName

    try {
      const response = await API.patch("/vendors/save-payment", {
        businessName,
        bankCode: values.bankCode,
        accountNumber: values.accountNumber,
        percentageCharge: 15,
      });
      // Update user profile in local storage with new payment details
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          paymentDetails: response.data.data,
        },
      };
      AuthService.setUser(updatedUser);
      toast.success("Payment details saved successfully!");
      console.log("Payment details saved:", response);
      router.replace("/vendorsDashboard/payment");
      // router.push("/vendorsDashboard/payment");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error saving payment details:", error);
        setError(
          error.response?.data?.message || "Failed to save payment details"
        );
        toast.error(
          error.response?.data?.message || "Failed to save payment details"
        );
      }
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Payment Details</CardTitle>
        <CardDescription>
          Enter your bank account details for payment processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter account number"
                        {...field}
                        maxLength={10}
                        className="rounded-md h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 items-end">
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-base font-medium">
                        Bank Name
                      </FormLabel>
                      <BankCombobox
                        banks={banks}
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={isLoadingBanks}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={verifyAccount}
                  disabled={
                    isVerifying ||
                    isLoadingBanks ||
                    accountNumber.length < 10 ||
                    !bankCode
                  }
                  className="h-10 px-4 bg-blue-600 hover:bg-blue-600/80"
                >
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>

              {/* Account Name field - not using FormItem to avoid the useFormField error */}
              <div className="space-y-2">
                <label className="text-base font-medium">Account Name</label>
                <Input
                  value={accountName ? accountName.toUpperCase() : ""}
                  readOnly
                  className="rounded-md h-12 bg-muted/30"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-10 mt-6 bg-blue-600 hover:bg-blue-600/80"
              disabled={!accountName || isVerifying || isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Save Payment Details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground">
          Your bank details will be securely stored and used only for payment
          processing.
        </p>
      </CardFooter>
    </Card>
  );
}

"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { verifyBankAccount, getBanks } from "@/lib/action"
import { getBanks, verifyBankAccount } from "@/lib/action"
import { BankCombobox } from "./BankComboBox"

// Form validation schema
const formSchema = z.object({
  accountNumber: z.string().length(10, { message: "Account number must be 10 digits" }),
  bankCode: z.string().min(1, { message: "Please select a bank" }),
})

interface Bank {
  id: number
  name: string
  code: string
  active: boolean
}

export default function VendorBankForm() {
  const [accountName, setAccountName] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      bankCode: "",
    },
  })

  useEffect(() => {
    async function loadBanks() {
      try {
        setIsLoadingBanks(true)
        const banksList = await getBanks()
        setBanks(banksList)
      } catch (error) {
        console.error("Failed to load banks:", error)
        setError("Failed to load banks. Please refresh the page.")
      } finally {
        setIsLoadingBanks(false)
      }
    }

    loadBanks()
  }, [])

  async function verifyAccount() {
    const values = form.getValues()

    if (!values.accountNumber || !values.bankCode) {
      form.trigger()
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await verifyBankAccount(values.accountNumber, values.bankCode)

      if (result.status) {
        setAccountName(result.data?.account_name || null)
      } else {
        setError(result.message || "Could not verify account details")
      }
    } catch {
      setError("An error occurred while verifying the account. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!accountName) {
      setError("Please verify your account details first")
      return
    }

    // Here you would typically save the payment details
    console.log("Saving payment details:", { ...values, accountName })

    // For demo purposes, show success message
    alert("Payment details saved successfully!")
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold">Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} maxLength={10} className="rounded-md h-12" />
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
                      <FormLabel className="text-base font-medium">Bank Name</FormLabel>
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
                  disabled={isVerifying || isLoadingBanks}
                  className="h-10 px-4"
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
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

            <Button type="submit" className="w-full h-11 mt-6" disabled={!accountName || isVerifying}>
              Save Payment Details
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


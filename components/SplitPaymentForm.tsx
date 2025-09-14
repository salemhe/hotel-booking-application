"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Divide, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {

  Form,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const splitPaymentSchema = z.object({
  totalAmount: z.number().min(1, "Total amount is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  participants: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address").optional(),
      phone: z.string().optional(),
      amount: z.number().min(1, "Amount is required"),
      paymentMethod: z.string().min(1, "Payment method is required"),
      status: z.enum(["pending", "paid"]).default("pending"),
    })
  ).min(2, "At least two participants are required for split payment"),
});

type SplitPaymentFormValues = z.infer<typeof splitPaymentSchema>;

interface SplitPaymentFormProps {
  totalAmount: number;
  onComplete: (data: unknown) => void;
  onCancel: () => void;
}

export default function SplitPaymentForm({
  totalAmount,
  onComplete,
  onCancel,
}: SplitPaymentFormProps) {
  const [participants, setParticipants] = useState([
    { name: "", email: "", phone: "", amount: 0, paymentMethod: "card", status: "pending" as const },
    { name: "", email: "", phone: "", amount: 0, paymentMethod: "card", status: "pending" as const },
  ]);

  const form = useForm<SplitPaymentFormValues>({
    resolver: zodResolver(splitPaymentSchema),
    defaultValues: {
      totalAmount,
      paymentMethod: "split",
      participants,
    },
  });

  const addParticipant = () => {
    const newParticipants = [
      ...participants,
      { name: "", email: "", phone: "", amount: 0, paymentMethod: "card", status: "pending" as const },
    ];
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };

  const removeParticipant = (index: number) => {
    if (participants.length <= 2) {
      toast.error("At least two participants are required for split payment");
      return;
    }
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };

  const updateParticipant = (index: number, field: string, value: unknown) => {
    const newParticipants = [...participants];
    (newParticipants[index] as Record<string, unknown>)[field] = value;
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };

  const distributeEvenly = () => {
    const evenAmount = Math.floor(totalAmount / participants.length);
    const remainder = totalAmount - evenAmount * participants.length;
    
    const newParticipants = participants.map((participant, index) => ({
      ...participant,
      amount: evenAmount + (index === 0 ? remainder : 0),
    }));
    
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };

  const onSubmit = (data: SplitPaymentFormValues) => {
    // Validate that the sum of participant amounts equals the total amount
    const totalParticipantAmount = data.participants.reduce((sum, p) => sum + p.amount, 0);
    
    if (totalParticipantAmount !== totalAmount) {
      toast.error(`The sum of all shares (₦${totalParticipantAmount}) must equal the total amount (₦${totalAmount})`);
      return;
    }
    
    // Process the split payment
    onComplete(data);
  };

  const calculateRemainingAmount = () => {
    const allocatedAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
    return totalAmount - allocatedAmount;
  };

  const remainingAmount = calculateRemainingAmount();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Split Payment</CardTitle>
        <CardDescription>
          Split the bill among multiple people and collect payments individually.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining to Allocate</p>
                <p className={`text-lg font-semibold ${remainingAmount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{remainingAmount.toLocaleString()}
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={distributeEvenly}
                className="flex items-center gap-2"
              >
                <Divide className="h-4 w-4" />
                Split Evenly
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Participants</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addParticipant}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Person
                </Button>
              </div>

              {participants.map((participant, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Person {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor={`participant-${index}-name`}>Name</FormLabel>
                        <Input
                          id={`participant-${index}-name`}
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, "name", e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor={`participant-${index}-email`}>Email (Optional)</FormLabel>
                        <Input
                          id={`participant-${index}-email`}
                          value={participant.email}
                          onChange={(e) => updateParticipant(index, "email", e.target.value)}
                          placeholder="Enter email"
                          type="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor={`participant-${index}-amount`}>Amount (₦)</FormLabel>
                        <Input
                          id={`participant-${index}-amount`}
                          value={participant.amount || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            updateParticipant(index, "amount", value);
                          }}
                          placeholder="Enter amount"
                          type="number"
                          min="0"
                          step="100"
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor={`participant-${index}-payment-method`}>Payment Method</FormLabel>
                        <Select
                          value={participant.paymentMethod}
                          onValueChange={(value) => updateParticipant(index, "paymentMethod", value)}
                        >
                          <SelectTrigger id={`participant-${index}-payment-method`}>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Card Payment</SelectItem>
                            <SelectItem value="paystack">Paystack</SelectItem>
                            <SelectItem value="transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={remainingAmount !== 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Process Split Payment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
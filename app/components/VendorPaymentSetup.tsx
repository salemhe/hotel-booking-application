import { useState } from 'react';
import { toast } from '@/app/components/ui/use-toast';
import { paymentService } from '../lib/api/services/paymentService';

export function VendorPaymentSetup() {
    const [formData, setFormData] = useState({
        businessName: '',
        bankCode: '',
        accountNumber: '',
        percentageCharge: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await paymentService.saveVendorPaymentDetails(formData);
            toast({
                title: "Success",
                description: "Payment details saved successfully",
            });
            
            // Update vendor context or state with new payment details
            // You might want to add this data to your global state management
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save payment details",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="businessName">Business Name</label>
                <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        businessName: e.target.value
                    }))}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            
            {/* Add other form fields similarly */}
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white p-2 rounded"
            >
                {isLoading ? 'Saving...' : 'Save Payment Details'}
            </button>
        </form>
    );
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'

export function MenuPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const doNotShow = localStorage.getItem('doNotShowMenuUploadPopup')
    if (doNotShow === 'true') {
      setDoNotShowAgain(true)
    }
  }, [])

  const menuUploadSteps = [
    "Basic Menu Information: Ensure you have a clear Dish Name, select an appropriate Category and Cuisine Type, provide a compelling Description, and have a high-quality Image ready for upload (JPEG/PNG, max 2MB).",
    "Pricing & Availability: Set a Price for your dish, add an optional Discount Price if applicable, update its Availability Status, and specify the expected Preparation Time.",
    "Portion & Customization: Define the Portion Size, select a Spice Level, specify any Add-ons or Extras available, and indicate Dietary Information such as Vegan, Gluten-Free, or Halal options.",
    "Inventory & Order Settings: Determine the Stock Quantity available for orders and set a maximum order limit per customer to manage supply effectively.",
    "Submission & Actions: Save your menu item as a Draft if you need to make further adjustments or Publish it immediately to make it visible to customers."
  ]

  const handleButtonClick = () => {
    if (doNotShowAgain) {
      router.push('/vendorDashboard/menu/add')
    } else {
      setIsOpen(true)
    }
  }

  const handleContinue = () => {
    if (doNotShowAgain) {
      localStorage.setItem('doNotShowMenuUploadPopup', 'true')
    }
    setIsOpen(false)
    router.push('/vendorDashboard/menu/add')
  }

  return (
    <>
      <Button onClick={handleButtonClick}><Plus className="w-4 h-4 mr-2" size={24} /> Add a Menu Item</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Prepare for Menu Upload</DialogTitle>
            <DialogDescription>
              Before adding a menu item, ensure you have the following information ready:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <ol className="list-decimal pl-5 space-y-2">
              {menuUploadSteps.map((step, index) => (
                <li key={index} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox 
              id="doNotShowAgain" 
              checked={doNotShowAgain} 
              onCheckedChange={(checked) => setDoNotShowAgain(checked as boolean)}
            />
            <label 
              htmlFor="doNotShowAgain" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not show this again
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleContinue}>Continue to Menu Upload</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
import { Calendar } from "lucide-react"
// import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"

export default function BookingForm() {
  return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Booking Information</h1>
          <p className="text-gray-500">Please fill up the blank fields below</p>

          <div className="flex items-center justify-center mt-6 mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <span>1</span>
              </div>
              <div className="w-16 h-1 bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span>2</span>
              </div>
              <div className="w-16 h-1 bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span>3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=300&width=400" alt="Ocean Basket" className="w-full h-56 object-cover" />
            <div className="p-4 bg-white">
              <h2 className="text-xl font-bold">Ocean Basket</h2>
              <p className="text-gray-500">Victoria Island</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick a Date</label>
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-md mr-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-lg">14 Feb</span>
              </div>
            </div>

            <div>
              <p className="text-lg text-gray-500">
                You will pay <span className="text-black font-bold text-xl">₦50,000 Naira</span>
              </p>
              <p className="text-lg text-gray-500">
                per <span className="text-black font-bold">Table</span>
              </p>
            </div>

            <Button className="w-full">Continue</Button>
          </div>
        </div>
      </div>
  )
}


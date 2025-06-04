import VendorBankForm from "@/app/components/VendorBankForm"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Payment Details</h1>
        <VendorBankForm />
      </div>
    </main>
  )
}


import PaymentMethodSelection from "@/components/paymentMethodSelection"

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <PaymentMethodSelection id={id} />
      </div>
    </main>
  )
}

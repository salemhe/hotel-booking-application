import ReservationDetails from "@/components/ReservationDetails";

export default function PaymentSuccess() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="text-green-600 text-3xl mb-2">✓</div>
        <h2 className="text-xl font-semibold">Your reservation is confirmed & your meal has been paid</h2>
        <p className="text-gray-600">Your pre-selected meals have been confirmed for your upcoming reservation</p>
      </div>
      <ReservationDetails />
      <div className="mt-4 text-sm bg-white border rounded p-3">
        <h4 className="font-semibold">Your Selection (7 Items)</h4>
        <ul className="list-disc pl-5 mt-2">
          <li>2 Caesar Salads - ₦16,000</li>
          <li>2 Grilled Catfishes - ₦16,000</li>
          <li>3 Cheese Springrolls - ₦10,000</li>
        </ul>
        <div className="mt-2">💳 Payment made at 8:03 PM, May 28, 2025</div>
        <div className="mt-2 font-semibold">Total: ₦42,000</div>
      </div>
      <div className="mt-6 text-center text-sm bg-green-100 p-3 rounded">
        You will receive a confirmation email with your reservation and meal details<br />
         Please, arrive 10 mins early
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-gray-200 px-4 py-2 rounded">Get Direction</button>
        <button className="bg-emerald-700 text-white px-4 py-2 rounded">Done</button>
      </div>
    </div>
  );
}

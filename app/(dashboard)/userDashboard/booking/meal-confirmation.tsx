import ReservationDetails from "@/app/components/ReservationDetails";
import MealSelectionSummary from "@/app/components/MealSelectionSummary";

export default function MealConfirmation() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="text-green-600 text-3xl mb-2">✓</div>
        <h2 className="text-xl font-semibold">Reservation Completed Successfully</h2>
        <p className="text-gray-600">Thank you for completing your reservation process. We look forward to seeing you.</p>
      </div>
      <ReservationDetails />
      <MealSelectionSummary />
      <div className="mt-6 text-sm text-yellow-700 bg-yellow-100 p-3 rounded">
         Special Request: One guest is allergic to garlic. Please consider this.
      </div>
      <div className="mt-6 text-center text-sm bg-green-100 p-3 rounded">
         You will receive a confirmation email with your reservation details<br />
         Please, arrive 10 mins early
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-gray-200 px-4 py-2 rounded">Get Direction</button>
        <button className="bg-emerald-700 text-white px-4 py-2 rounded">Done</button>
      </div>
    </div>
  );
}
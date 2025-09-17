export default function MealSelectionSummary() {
  return (
    <div className="bg-white p-4 rounded shadow my-6">
      <h3 className="font-semibold mb-2">Your Meal Selection</h3>
      <div>
        <p><strong>Appetizer:</strong> Caesar Salad × 2</p>
        <p><strong>Main Course:</strong> Grilled Catfish × 2</p>
        <p><strong>Dessert:</strong> Cheese Springroll × 3</p>
      </div>
      <div className="mt-2 font-semibold">Total: ₦42,000</div>
    </div>
  );
}
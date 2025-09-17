import { Suspense } from 'react';
import MealSelectionComponent from './MealSelectionComponent';
import { Skeleton } from '@/components/ui/skeleton'; // Example for a loading UI

// A simple loading fallback component
function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreSelectMealPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MealSelectionComponent />
    </Suspense>
  );
}
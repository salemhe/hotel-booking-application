// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({ error }: { error: Error;}) {
  useEffect(() => {
    console.error('Server-side render error:', error);
  }, [error]);

  return (
    <div className="p-4 text-red-600">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p>{error.message}</p>
      <button
          onClick={() => window.location.reload()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}

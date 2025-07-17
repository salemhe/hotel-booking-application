"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export default function ErrorFallback({
  error,
  onRetry,
  title = "Something went wrong",
  description = "We're having trouble loading this content. Please try again.",
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-yellow-600" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>

      {error && (
        <details className="mb-6 text-sm text-gray-500">
          <summary className="cursor-pointer">Technical details</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
            {error}
          </pre>
        </details>
      )}

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>

        {onRetry && (
          <Button onClick={onRetry} className="bg-teal-600 hover:bg-teal-700">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

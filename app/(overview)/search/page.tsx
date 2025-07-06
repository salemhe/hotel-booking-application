"use client"
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SearchResults } from '@/app/components/SearchResults';




// Loading component for Suspense fallback
const SearchLoading = () => (
  <div className="min-h-screen mt-[100px] bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading search...</span>
      </div>
    </div>
  </div>
);

// Main page component - this is what gets exported
const SearchPage = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;
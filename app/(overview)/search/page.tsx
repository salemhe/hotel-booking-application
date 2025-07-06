"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const SearchResultsInner = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  return (
    <div>
      {query ? <p>Search Query: {query}</p> : <p>No search query.</p>}
    </div>
  );
};

const SearchLoading = () => (
  <div className="min-h-screen mt-[100px] bg-gray-50 flex justify-center items-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    <span className="ml-2 text-gray-600">Loading search...</span>
  </div>
);

const SearchResults = () => (
  <Suspense fallback={<SearchLoading />}>
    <SearchResultsInner />
  </Suspense>
);

const SearchPage = () => <SearchResults />;

export default SearchPage;
"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetcher } from "@/app/lib/fetcher";

export interface Branch {
  id: number;
  branchName: string;
  address: string;
  city?: string;
  state?: string;
  phone?: string;
  opensAt?: string;
  closesAt?: string;
  selectedDays?: string[];
  manager?: string;
  menu?: string;
  importMenuItems?: boolean;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranchContext = () => {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranchContext must be used within BranchProvider");
  return ctx;
};

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const fetchBranches = async () => {
    try {
      // Use a more robust approach with retry mechanism and better error handling
      const fetchWithRetry = async (retries = 2): Promise<Branch[]> => {
        try {
          // If using JWT, get token from localStorage (or context)
          const url = "/api/branches";
          const result = await apiFetcher(url);
          
          // Check if result contains error with improved error message handling
          if (result && typeof result === 'object' && 'isError' in result && result.isError) {
            let errorMessage = 'Unknown error';
            if (result.error) {
              if (typeof result.error === 'string') {
                errorMessage = result.error;
              } else if (typeof result.error === 'object') {
                if ('message' in result.error && typeof result.error.message === 'string') {
                  errorMessage = result.error.message;
                } else {
                  // Try to create a meaningful message from the error object
                  errorMessage = `API Error: ${JSON.stringify(result.error).substring(0, 100)}`;
                }
              }
            }
            
            console.warn(`Error in branch API response (attempt ${3-retries}/3): ${errorMessage}`);
            
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 800)); // Wait before retry
              return fetchWithRetry(retries - 1);
            }
            
            // Log detailed error after all retries fail
            console.error("All branch API retries failed:", { 
              error: result.error, 
              url: "/api/branches"
            });
            
            return [];
          }
          
          // Handle different response formats
          if (result === null || result === undefined) {
            console.warn("API returned null or undefined response");
            return [];
          }
          
          // Ensure we have an array of branches
          let data: Branch[] = [];
          
          if (Array.isArray(result)) {
            data = result;
          } else if (result && typeof result === 'object' && 'branches' in result && Array.isArray(result.branches)) {
            data = result.branches;
          } else if (result && typeof result === 'object') {
            // Try to extract branch data from unexpected response format
            const possibleArrays = Object.values(result).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              // Use the first array found in the response
              data = possibleArrays[0] as Branch[];
            }
          }
          
          console.log("Branches data received:", data.length);
          return data;
        } catch (error) {
          console.error("Exception fetching branches:", 
            error && typeof error === 'object' && 'message' in error ? error.message : 'Unknown error');
          
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 800)); // Wait before retry
            return fetchWithRetry(retries - 1);
          }
          return [];
        }
      };
      
      // Execute the fetch with retry
      const data = await fetchWithRetry();
      
      // Update state with fetched data
      setBranches(data);
      
      // Update selected branch if needed
      if (!selectedBranch && data.length > 0) {
        setSelectedBranch(data[0]);
      } else if (selectedBranch && data.length > 0) {
        // Update selectedBranch if it exists in the new data
        const found = data.find(b => b.id === selectedBranch.id);
        if (found) setSelectedBranch(found);
      }
    } catch (error) {
      console.error("Error in branch fetching:", 
        error && typeof error === 'object' && 'message' in error ? error.message : 'Unknown error');
      // Set empty branches array to prevent undefined errors
      setBranches([]);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <BranchContext.Provider value={{ branches, selectedBranch, setSelectedBranch, refreshBranches: fetchBranches }}>
      {children}
    </BranchContext.Provider>
  );
};

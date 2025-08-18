"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetcherWithRetry, isApiError } from "@/app/lib/fetcher-improved";

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
  loading: boolean;
  error: string | null;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFetcherWithRetry<Branch[]>("/api/branches", {}, 2, 1000);
      
      if (isApiError(result)) {
        console.error("Failed to fetch branches:", result.error.message);
        setError(result.error.message || "Failed to load branches");
        setBranches([]);
      } else {
        const data = Array.isArray(result) ? result : [];
        setBranches(data);
        
        // Update selected branch if needed
        if (!selectedBranch && data.length > 0) {
          setSelectedBranch(data[0]);
        } else if (selectedBranch && data.length > 0) {
          const found = data.find(b => b.id === selectedBranch.id);
          if (found) setSelectedBranch(found);
        }
      }
    } catch (err) {
      console.error("Unexpected error fetching branches:", err);
      setError("An unexpected error occurred");
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const refreshBranches = async () => {
    await fetchBranches();
  };

  return (
    <BranchContext.Provider value={{ 
      branches, 
      selectedBranch, 
      setSelectedBranch, 
      refreshBranches,
      loading,
      error
    }}>
      {children}
    </BranchContext.Provider>
  );
};

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
      // If using JWT, get token from localStorage (or context)
      const url = "/api/branches";
      const data = await apiFetcher(url);
      setBranches(data);
      if (!selectedBranch && data.length > 0) setSelectedBranch(data[0]);
      if (selectedBranch) {
        // Update selectedBranch if it exists in the new data
        const found = data.find((b: Branch) => b.id === selectedBranch.id);
        if (found) setSelectedBranch(found);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
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

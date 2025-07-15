"use client";

import React, { createContext, useContext, useState } from "react";

export type Profile = {
  name: string;
  email: string;
  phone: string;
};

const defaultProfile: Profile = {
  name: "Joseph Eyebiokin",
  email: "joseph@bookies.com",
  phone: "+2347012345678",
};

export const ProfileContext = createContext<{
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
} | null>(null);

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

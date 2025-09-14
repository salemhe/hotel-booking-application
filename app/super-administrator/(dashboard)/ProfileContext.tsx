import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthService, UserProfile } from "@/lib/api/services/auth.service";

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  profileLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setProfileLoading(true)
      const user = AuthService.getUser();
      if (user && user.id) {
        const profileData = await AuthService.fetchMyProfile(user.id);
        setProfile(profileData);
      } }
      catch (err) {
        console.log(err);
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, profileLoading }}>
      {children}
    </ProfileContext.Provider> 
  );
};

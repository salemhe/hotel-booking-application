"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, XCircle, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/super-administrator/ThemeContext";

export default function HotelSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: ""
  });
  const { theme, setTheme } = useTheme();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [themeMsg, setThemeMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { AuthService } = await import("@/app/lib/api/services/auth.service");
        const user = AuthService.getUser();
        if (user && user.id) {
          const realProfile = await AuthService.fetchMyProfile(user.id, user.role);
          if (realProfile) {
            setProfile({
              name: realProfile.businessName || realProfile.name || "",
              email: realProfile.email || "",
              phone: realProfile.phone || "",
              profileImage: realProfile.profileImage || ""
            });
          }
        }
      } catch {
        setProfile({ name: "", email: "", phone: "", profileImage: "" });
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSavingProfile(true);
    setProfileMsg("");
    setProfileError("");
    setTimeout(() => {
      if (field === "email" && !value.includes("@")) {
        setSavingProfile(false);
        setProfileError("Invalid email address.");
        return;
      }
      setSavingProfile(false);
      setProfileMsg("Profile updated!");
    }, 900);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setThemeMsg("");
    setTimeout(() => {
      setThemeMsg(`Theme set to ${theme === "light" ? "Dark" : "Light"} Mode!`);
    }, 400);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    if (password.new.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (password.new !== password.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPassword({ current: "", new: "", confirm: "" });
      setPasswordMsg("Password changed successfully!");
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Settings</h1>
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-2">
          {profile.name.trim().length > 0 ? profile.name.split(" ").map(n => n[0]).join("") : "?"}
        </div>
        <div className="text-lg font-semibold">{profile.name || <span className='text-gray-400'>No Name</span>}</div>
        <div className="text-sm text-gray-600">{profile.email || <span className='text-gray-400'>No Email</span>}</div>
        <div className="text-sm text-gray-600">{profile.phone || <span className='text-gray-400'>No Phone</span>}</div>
      </div>
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="w-full"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="w-full"
              type="email"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={profile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              className="w-full"
              type="tel"
              autoComplete="tel"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 min-h-[24px]">
            {savingProfile && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {profileMsg && <span className="flex items-center text-green-600 text-sm"><CheckCircle className="w-4 h-4 mr-1" />{profileMsg}</span>}
            {profileError && <span className="flex items-center text-red-600 text-sm"><XCircle className="w-4 h-4 mr-1" />{profileError}</span>}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Sun className="w-5 h-5 text-yellow-400" /> Light
          </span>
          <Switch checked={theme === "dark"} onChange={handleThemeToggle} />
          <span className="flex items-center gap-2 text-sm font-medium">
            <Moon className="w-5 h-5 text-gray-700" /> Dark
          </span>
          {themeMsg && <span className="flex items-center text-green-600 text-sm ml-2"><CheckCircle className="w-4 h-4 mr-1" />{themeMsg}</span>}
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <Input
                  value={password.current}
                  onChange={e => setPassword({ ...password, current: e.target.value })}
                  type="password"
                  className="w-full"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <Input
                  value={password.new}
                  onChange={e => setPassword({ ...password, new: e.target.value })}
                  type="password"
                  className="w-full"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <Input
                  value={password.confirm}
                  onChange={e => setPassword({ ...password, confirm: e.target.value })}
                  type="password"
                  className="w-full"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={savingPassword}>
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" /> : null}
              Change Password
            </Button>
            <div className="min-h-[24px] text-center">
              {passwordMsg && <span className="flex items-center justify-center text-green-600 text-sm"><CheckCircle className="w-4 h-4 mr-1" />{passwordMsg}</span>}
              {passwordError && <span className="flex items-center justify-center text-red-600 text-sm"><XCircle className="w-4 h-4 mr-1" />{passwordError}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

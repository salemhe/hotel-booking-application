"use client";
import React from "react";
import VendorSettingsForm from "./VendorSettingsForm"; // adjust path if needed

export default function Page() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Restaurant Settings</h2>

     
      {/* Your form */}
      <VendorSettingsForm />
    </div>
  );
}


// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   User,
//   Lock,
//   Building,
//   Camera,
//   Link as LinkIcon,
//   FileText,
//   Settings as SettingsIcon,
//   Eye,
//   EyeOff,
//   ChevronDown,
//   Search,
//   CircleCheck,
//   CircleStop,
//   X,
// } from "lucide-react";
// import Image from "next/image";
// import { useUser } from "@/app/contexts/VendorContext";
// import { toast } from "sonner";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/app/components/ui/button";
// import { validateImageFiles } from "@/lib/utils/fileValidation";
// interface TabProps {
//   label: string;
//   icon: React.ReactNode;
//   isActive: boolean;
//   onClick: () => void;
// }

// const Tab = ({ label, icon, isActive, onClick }: TabProps) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-3 transition-colors relative whitespace-nowrap text-sm sm:text-base ${
//       isActive
//         ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900"
//         : "text-gray-500 hover:text-gray-700"
//     }`}
//   >
//     {icon}
//     <span className="font-medium">{label}</span>
//   </button>
// );

// interface PreferencesState {
//   currency: string;
//   marketing: boolean;
//   giftUpdates: boolean;
//   wishReview: boolean;
//   anonymousWish: boolean;
//   wishNotifications: boolean;
//   timezone: string;
// }

// interface ImagePreview {
//   url: string;
//   id: string;
//   file?: File;
//   existingId?: string;
// }

// export default function Settings() {
//   const { user, mutate } = useUser();
//   const searchParams = useSearchParams();
//   const [activeTab, setActiveTab] = useState(
//     searchParams.get("tab") || "personal"
//   );
//   const [preferences, setPreferences] = useState<PreferencesState>({
//     currency: "NGN",
//     marketing: user?.preferences?.marketingUpdates || false,
//     giftUpdates: user?.preferences?.newGiftUpdates || false,
//     wishReview: user?.preferences?.reviewWishBeforePublic || false,
//     anonymousWish: user?.preferences?.allowAnonymousWishes || false,
//     wishNotifications: user?.preferences?.wishNotifications || false,
//     timezone:
//       user?.preferences?.timezone ||
//       Intl.DateTimeFormat().resolvedOptions().timeZone,
//   });
//   const [bankInfo, setBankInfo] = useState({
//     accountName: "",
//     accountNumber: "",
//     bankName: "",
//     currency: "NGN",
//   });

//   const [cryptoWallet, setCryptoWallet] = useState("");
//   const [isValidWallet, setIsValidWallet] = useState<boolean | null>(null);
//   const [personalInfo, setPersonalInfo] = useState({
//     firstName: "",
//     lastName: "",
//     displayName: "",
//     username: "",
//     email: "",
//     bio: "",
//     photos: [{
//       file: null as File | null,
//       id: null as string | null,
//     }]
//   });
//   const [isUsernameAvailable, setIsUsernameAvailable] = useState<
//     boolean | null
//   >(null);
//   const [isChecking, setIsChecking] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [banks, setBanks] = useState<Array<{ name: string; code: string }>>([]);
//     const [images, setImages] = useState<ImagePreview[]>([]);
//   const [selectedBank, setSelectedBank] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isFetchingBanks, setIsFetchingBanks] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [hasStartedTyping, setHasStartedTyping] = useState(false);
//   const [securityForm, setSecurityForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordChecks, setPasswordChecks] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });
//   const [bankSearchQuery, setBankSearchQuery] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);


//   useEffect(() => {
//     const tab = searchParams.get("tab");
//     if (tab) {
//       setActiveTab(tab);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (user) {
//       const nameParts = user.businessName.split(" ");
//       setPersonalInfo({
//         firstName: nameParts[0] || "",
//         lastName: nameParts[1] || "",
//         displayName: user.display_name || user.name || "",
//         username: user.username || "",
//         email: user.email || "",
//         bio: user.bio || "",
//         photo: null,
//         photoPreview: user.avatar || null,
//       });
//       if (user.bank_info) {
//         setBankInfo({
//           accountName: user.bank_info.account_name || "",
//           accountNumber: user.bank_info.account_number || "",
//           bankName: user.bank_info.bank_name || "",
//           currency: user.bank_info.currency || "NGN",
//         });
//         setSelectedBank(user.bank_info.bank_code || "");
//       }

//       if (user.usdt_wallet_address) {
//         setCryptoWallet(user.usdt_wallet_address || "");
//       }
//     }
//   }, [user]);

//   const checkUsernameAvailability = async (value: string) => {
//     if (value.length >= 3) {
//       setIsChecking(true);
//       try {
//         const response = await authService.checkUsername(value);
//         setIsUsernameAvailable(response.data?.is_available || false);
//       } catch (error) {
//         setIsUsernameAvailable(false);
//       } finally {
//         setIsChecking(false);
//       }
//     } else {
//       setIsUsernameAvailable(null);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;

//     if (name === "firstName" || name === "lastName") {
//       const capitalizedValue = value.replace(/\s/g, "");
//       if (capitalizedValue.length > 0) {
//         setPersonalInfo((prev) => ({
//           ...prev,
//           [name]:
//             capitalizedValue.charAt(0).toUpperCase() +
//             capitalizedValue.slice(1),
//         }));
//       } else {
//         setPersonalInfo((prev) => ({ ...prev, [name]: capitalizedValue }));
//       }
//     } else {
//       setPersonalInfo((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const fullName =
//         `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

//       const formDataToSend = new FormData();
//       formDataToSend.append("name", fullName);
//       formDataToSend.append("display_name", personalInfo.displayName);
//       formDataToSend.append("username", personalInfo.username);
//       formDataToSend.append("bio", personalInfo.bio);

//       if (personalInfo.photo instanceof File) {
//         formDataToSend.append("images", personalInfo.photo);
//       }

//       const response = await authService.updateProfile(formDataToSend);

//       if (response.data?.success) {
//         toast.success(response.data.message);
//         mutate();
//       } else {
//         toast.error(response.error || "Failed to update profile");
//       }
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred while updating profile"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSaveBankInfo = async () => {
//     setIsSubmitting(true);

//     try {
//       const data = {
//         bank_info: {
//           account_number: bankInfo.accountNumber,
//           account_name: bankInfo.accountName,
//           bank_name: bankInfo.bankName,
//           bank_code: selectedBank,
//           currency: bankInfo.currency || preferences.currency,
//         },
//         usdt_wallet_address: cryptoWallet,
//       };

//       const response = await authService.updateProfile(data);

//       if (response.data?.success) {
//         toast.success("Payment information updated successfully");
//         mutate();
//       } else {
//         toast.error(response.error || "Failed to update payment information");
//       }
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred while updating payment information"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const fetchBanks = async (currency: string) => {
//     try {
//       setIsFetchingBanks(true);
//       const response = await userService.fetchBanks(currency);
//       setBanks(response?.data || []);
//       setSelectedBank("");
//       setBankInfo((prev) => ({
//         ...prev,
//         accountName: user?.bank_info?.account_name || "",
//         bankName: user?.bank_info?.bank_name || "",
//       }));
//     } catch (error) {
//       toast.error("Failed to fetch banks");
//     } finally {
//       setIsFetchingBanks(false);
//     }
//   };

//   const verifyBankAccount = async () => {
//     if (!selectedBank || !bankInfo.accountNumber) {
//       toast.error("Please select a bank and enter account number");
//       return;
//     }

//     setIsVerifying(true);
//     try {
//       const response = await userService.verifyBank({
//         accountNumber: bankInfo.accountNumber,
//         bankCode: selectedBank,
//       });

//       if (response?.data?.accountName) {
//         setBankInfo((prev) => ({
//           ...prev,
//           accountName: response.data.accountName,
//           bankName:
//             banks.find((bank) => bank.code === selectedBank)?.name || "",
//         }));
//         toast.success("Bank account verified successfully");
//       } else {
//         toast.error("Could not verify bank account");
//       }
//     } catch (error) {
//       toast.error("Failed to verify bank account");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   useEffect(() => {
//     if (
//       !["USD", "EUR", "GBP"].includes(bankInfo.currency || preferences.currency)
//     ) {
//       fetchBanks(bankInfo.currency || preferences.currency);
//     }
//   }, [bankInfo.currency, preferences.currency]);

//   const validatePassword = (password: string) => {
//     return {
//       length: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /\d/.test(password),
//       special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//     };
//   };

//   const handleSecurityFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setSecurityForm((prev) => ({ ...prev, [name]: value }));

//     if (name === "newPassword") {
//       if (!hasStartedTyping && value.length > 0) {
//         setHasStartedTyping(true);
//       }
//       setPasswordChecks(validatePassword(value));
//     }
//   };

//   const handleUpdatePassword = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!Object.values(passwordChecks).every(Boolean)) {
//       toast.error("Please ensure your new password meets all requirements");
//       return;
//     }

//     if (securityForm.newPassword !== securityForm.confirmPassword) {
//       toast.error("New passwords do not match");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response =
//         user?.auth_mode === "google"
//           ? await authService.setPassword(securityForm.newPassword)
//           : await authService.updatePassword({
//               currentPassword: securityForm.currentPassword,
//               newPassword: securityForm.newPassword,
//             });

//       if (response.data?.success) {
//         toast.success(response.data.message || "Password updated successfully");
//         setSecurityForm({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         });
//         setHasStartedTyping(false);
//         if (user?.auth_mode === "google") {
//           mutate();
//         }
//       } else if (response.error) {
//         toast.error(response.error);
//       }
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.error ||
//           error.response?.data?.message ||
//           "Failed to update password"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const validateTrc20Address = (address: string) => {
//     // TRC20 address should start with T and be 34 characters long
//     const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
//     return trc20Regex.test(address);
//   };

//   const filteredBanks = banks.filter((bank) =>
//     bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase())
//   );

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const fileArray = Array.from(files);
//     const validationErrors = validateImageFiles(fileArray);

//     if (validationErrors.length > 0) {
//       validationErrors.forEach((error) => {
//         toast.error(`${error.file.name}: ${error.error}`);
//       });
//       return;
//     }

//     const newImages = fileArray.map((file) => ({
//       url: URL.createObjectURL(file),
//       id: Math.random().toString(36).substr(2, 9),
//       file,
//     }));

//     setPersonalInfo((prev) => ({
//       ...prev,
//       photos: [...prev.photos, ...newImages].slice(0, 5),
//     }));

//     setImages((prev) => {
//       const updatedImages = [...prev, ...newImages].slice(0, 5);
//       // Revoke URLs for any images that didn't make the cut to prevent memory leaks
//       newImages
//         .slice(5 - prev.length)
//         .forEach((img) => URL.revokeObjectURL(img.url));
//       return updatedImages;
//     });
//   };

//   const removeImage = async (id: string, existingId?: string) => {
//     try {
//       if (existingId) {
//         const response = await celebrationService.deleteCelebrationImage(
//           params.id as string,
//           existingId
//         );
//         if (response.success) {
//           setImages((prev) => prev.filter((img) => img.id !== id));
//           toast.success("Image deleted successfully");
//         } else {
//           toast.error("Failed to delete image");
//         }
//       } else {
//         setImages((prev) => prev.filter((img) => img.id !== id));
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       toast.error("Failed to delete image");
//     }
//   };

//   const renderPersonalInfo = () => (
//     <form onSubmit={handleUpdateProfile} className="space-y-6">
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">
//           Celebration Photos
//         </h2>
//         <p className="text-gray-600 text-sm mb-6">
//           Upload up to 5 photos to showcase your special moment
//         </p>

//         <div className="flex flex-wrap gap-2">
//           {images.map((image) => (
//             <div
//               key={image.id}
//               className="relative aspect-square w-[150px] rounded-lg overflow-hidden group"
//             >
//               <div className="absolute inset-0 bg-gray-200 animate-pulse" />
//               <Image
//                 src={image.url}
//                 alt="Preview"
//                 fill
//                 sizes="(max-width: 150px) 100vw, 150px"
//                 className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//                 onLoadingComplete={(image) => {
//                   image.classList.remove("opacity-0");
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(image.id, image.existingId)}
//                 className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <X className="w-3 h-3 text-white" />
//               </button>
//             </div>
//           ))}

//           {images.length < 5 && (
//             <label className="aspect-square w-[150px] rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#e91e63] transition-colors">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 multiple
//                 className="hidden"
//               />
//               <div className="text-center">
//                 <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
//                 <p className="text-xs text-gray-600">Add Photos</p>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   {images.length}/5 photos
//                 </p>
//               </div>
//             </label>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             First Name
//           </label>
//           <input
//             type="text"
//             name="firstName"
//             value={personalInfo.firstName}
//             onChange={handleChange}
//             maxLength={20}
//             placeholder="Enter your first name"
//             className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Last Name
//           </label>
//           <input
//             type="text"
//             name="lastName"
//             value={personalInfo.lastName}
//             onChange={handleChange}
//             maxLength={20}
//             placeholder="Enter your last name"
//             className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Display Name
//         </label>
//         <input
//           type="text"
//           value={personalInfo.displayName}
//           onChange={(e) =>
//             setPersonalInfo({ ...personalInfo, displayName: e.target.value })
//           }
//           placeholder="How you want to be known"
//           className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Thelo Link
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//             <LinkIcon className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
//             <span className="text-gray-500">thelo.me/</span>
//           </div>
//           <input
//             type="text"
//             value={personalInfo.username}
//             onChange={(e) => {
//               const value = e.target.value.toLowerCase();
//               if (value.length === 0 || /^[a-z0-9._]*$/.test(value)) {
//                 setPersonalInfo({ ...personalInfo, username: value });
//                 if (value !== user?.username && value.length >= 3) {
//                   checkUsernameAvailability(value);
//                 } else {
//                   setIsUsernameAvailable(null);
//                 }
//               }
//             }}
//             maxLength={25}
//             placeholder="username"
//             className="mt-1 block w-full rounded-xl border border-gray-200 pl-28 pr-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors"
//           />
//           {personalInfo.username.length >= 3 &&
//             personalInfo.username !== user?.username && (
//               <div className="absolute inset-y-0 right-3 flex items-center">
//                 {isChecking ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
//                 ) : isUsernameAvailable ? (
//                   <FontAwesomeIcon
//                     icon={faCircleCheck}
//                     className="w-5 h-5 text-green-500"
//                   />
//                 ) : (
//                   <FontAwesomeIcon
//                     icon={faTimesCircle}
//                     className="w-5 h-5 text-red-500"
//                   />
//                 )}
//               </div>
//             )}
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email</label>
//         <input
//           type="email"
//           value={personalInfo.email}
//           placeholder="Your email address"
//           disabled
//           className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors cursor-not-allowed"
//         />
//       </div>

//       <div>
//         <div className="flex items-center justify-between">
//           <label className="block text-sm font-medium text-gray-700">Bio</label>
//           <span className="text-sm text-gray-500">
//             {personalInfo.bio.length}/160
//           </span>
//         </div>
//         <div className="relative">
//           <div className="absolute left-3 top-3 flex items-center pointer-events-none">
//             <FileText className="w-5 h-5 text-gray-400" />
//           </div>
//           <textarea
//             value={personalInfo.bio}
//             onChange={(e) =>
//               setPersonalInfo({ ...personalInfo, bio: e.target.value })
//             }
//             maxLength={160}
//             rows={4}
//             placeholder="Tell us about yourself"
//             className="mt-1 block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors resize-none"
//           />
//         </div>
//       </div>

//       <Button
//         className="w-full"
//         type="submit"
//         // loading={isSubmitting}
//         disabled={
//           isChecking ||
//           (personalInfo.username !== user?.username && !isUsernameAvailable)
//         }
//       >
//         Save Changes
//       </Button>
//     </form>
//   );

//   const renderBankInfo = () => (
//     <div className="space-y-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Payout Currency
//         </label>
//         <div className="relative">
//           <select
//             value={bankInfo.currency || preferences.currency}
//             onChange={(e) => {
//               setBankInfo({
//                 ...bankInfo,
//                 currency: e.target.value,
//                 accountName: "",
//                 accountNumber: "",
//                 bankName: "",
//               });
//               setSelectedBank("");
//             }}
//             className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors appearance-none"
//           >
//             <option value="NGN">Nigerian Naira (₦)</option>
//             <option value="USD">US Dollar ($)</option>
//             <option value="EUR">Euro (€)</option>
//             <option value="GBP">British Pound (£)</option>
//             <option value="KES">Kenyan Shilling (KSh)</option>
//             <option value="ZAR">South African Rand (R)</option>
//             <option value="GHS">Ghanaian Cedi (₵)</option>
//           </select>
//           <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
//         </div>
//       </div>

//       {!["USD", "EUR", "GBP"].includes(
//         bankInfo.currency || preferences.currency
//       ) ? (
//         <>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Account Number
//             </label>
//             <input
//               type="text"
//               value={bankInfo.accountNumber}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "").slice(0, 12);
//                 setBankInfo({
//                   ...bankInfo,
//                   accountNumber: value,
//                   accountName: "",
//                 });
//               }}
//               minLength={10}
//               maxLength={12}
//               placeholder="Enter account number"
//               className={`mt-1 block w-full rounded-xl border px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
//                 bankInfo.accountNumber && bankInfo.accountNumber.length < 10
//                   ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
//                   : "border-gray-200 focus:border-secondary-500 focus:ring-secondary-500/20"
//               }`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Bank Name
//             </label>
//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <button
//                   type="button"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors text-left relative"
//                 >
//                   {isFetchingBanks ? (
//                     <span className="text-gray-500">Loading banks...</span>
//                   ) : selectedBank ? (
//                     banks.find((bank) => bank.code === selectedBank)?.name ||
//                     "Select Bank"
//                   ) : (
//                     "Select Bank"
//                   )}
//                   <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px] overflow-auto">
//                     <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
//                       <div className="relative">
//                         <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                         <input
//                           type="text"
//                           value={bankSearchQuery}
//                           onChange={(e) => setBankSearchQuery(e.target.value)}
//                           placeholder="Search banks..."
//                           className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 text-sm"
//                         />
//                       </div>
//                     </div>
//                     <div className="py-1">
//                       {isFetchingBanks ? (
//                         <div className="px-4 py-2 text-sm text-gray-500">
//                           Loading banks...
//                         </div>
//                       ) : filteredBanks.length > 0 ? (
//                         filteredBanks.map((bank) => (
//                           <button
//                             key={bank.code}
//                             type="button"
//                             onClick={() => {
//                               setSelectedBank(bank.code);
//                               setBankInfo((prev) => ({
//                                 ...prev,
//                                 bankName: bank.name,
//                                 accountName: "",
//                               }));
//                               setIsDropdownOpen(false);
//                               setBankSearchQuery("");
//                             }}
//                             className={`w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${
//                               selectedBank === bank.code ? "bg-gray-50" : ""
//                             }`}
//                           >
//                             {bank.name}
//                           </button>
//                         ))
//                       ) : (
//                         <div className="px-4 py-2 text-sm text-gray-500">
//                           No banks found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <Button
//                 variant="outline"
//                 className="mt-1 h-[50px] px-4"
//                 onClick={verifyBankAccount}
//                 // loading={isVerifying}
//                 disabled={
//                   !selectedBank || !bankInfo.accountNumber || isVerifying
//                 }
//               >
//                 Verify
//               </Button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Account Name
//             </label>
//             <input
//               type="text"
//               value={bankInfo.accountName}
//               placeholder="Account Name"
//               readOnly
//               className="mt-1 block  w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors"
//             />
//           </div>
//         </>
//       ) : null}

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           USDT TRC20 Wallet Address{" "}
//           {["USD", "EUR", "GBP"].includes(
//             bankInfo.currency || preferences.currency
//           )
//             ? "(Required)"
//             : "(Optional)"}
//         </label>
//         <div className="relative">
//           <input
//             type="text"
//             value={cryptoWallet}
//             onChange={(e) => {
//               const value = e.target.value.trim();
//               setCryptoWallet(value);
//               setIsValidWallet(value ? validateTrc20Address(value) : null);
//             }}
//             placeholder="Enter your USDT TRC20 wallet address"
//             className={`mt-1 block w-full rounded-xl border px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
//               cryptoWallet
//                 ? isValidWallet
//                   ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
//                   : "border-red-300 focus:border-red-500 focus:ring-red-500/20"
//                 : "border-gray-200 focus:border-secondary-500 focus:ring-secondary-500/20"
//             }`}
//           />
//           {cryptoWallet && (
//             <div className="absolute inset-y-0 right-3 flex items-center">
//               {isValidWallet ? (
//                 <CircleCheck className="w-5 h-5 text-green-500" />
//               ) : (
//                 <CircleStop className="w-5 h-5 text-red-500" />
//               )}
//             </div>
//           )}
//         </div>
//         {cryptoWallet && !isValidWallet && (
//           <p className="mt-1 text-sm text-red-500">
//             Please enter a valid TRC20 wallet address (starts with T and is 34
//             characters long)
//           </p>
//         )}
//       </div>
//       <Button
//         className="w-full"
//         onClick={handleSaveBankInfo}
//         // loading={isSubmitting}
//         disabled={
//           (["USD", "EUR", "GBP"].includes(
//             bankInfo.currency || preferences.currency
//           ) &&
//             (!cryptoWallet || !isValidWallet)) ||
//           (!["USD", "EUR", "GBP"].includes(
//             bankInfo.currency || preferences.currency
//           ) &&
//             (!bankInfo.accountNumber || !bankInfo.accountName || !selectedBank))
//         }
//       >
//         Save Payment Information
//       </Button>
//     </div>
//   );

//   const renderSecurity = () => (
//     <form onSubmit={handleUpdatePassword} className="space-y-6">
//       {user?.auth_mode === "google" ? (
//         <>
//           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
//             <p className="text-sm text-blue-700">
//               You currently sign in with Google. Setting up a password will
//               change your login method to email and password.
//             </p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 name="newPassword"
//                 value={securityForm.newPassword}
//                 onChange={handleSecurityFormChange}
//                 placeholder="Enter new password"
//                 className={`mt-1 block w-full rounded-xl border px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
//                   hasStartedTyping
//                     ? securityForm.newPassword
//                       ? Object.values(passwordChecks).every(Boolean)
//                         ? "border-green-300 focus:ring-green-500/20 focus:border-green-500"
//                         : "border-red-300 focus:ring-red-500/20 focus:border-red-500"
//                       : "border-gray-200 focus:ring-secondary-500/20 focus:border-secondary-500"
//                     : "border-gray-200 focus:ring-secondary-500/20 focus:border-secondary-500"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showNewPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {hasStartedTyping && (
//               <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700">
//                     Password strength
//                   </span>
//                   <span
//                     className={`text-xs font-medium ${
//                       Object.values(passwordChecks).filter(Boolean).length === 0
//                         ? "text-gray-400"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 2
//                         ? "text-red-500"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 4
//                         ? "text-yellow-500"
//                         : "text-green-500"
//                     }`}
//                   >
//                     {Object.values(passwordChecks).filter(Boolean).length === 0
//                       ? "Too weak"
//                       : Object.values(passwordChecks).filter(Boolean).length <=
//                         2
//                       ? "Weak"
//                       : Object.values(passwordChecks).filter(Boolean).length <=
//                         4
//                       ? "Medium"
//                       : "Strong"}
//                   </span>
//                 </div>

//                 <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full transition-all duration-300 ${
//                       Object.values(passwordChecks).filter(Boolean).length === 0
//                         ? "w-0 bg-gray-300"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 2
//                         ? "w-1/3 bg-red-500"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 4
//                         ? "w-2/3 bg-yellow-500"
//                         : "w-full bg-green-500"
//                     }`}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.length
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.length
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 8 characters
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.number
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.number
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 1 number
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.special
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.special
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 1 special character
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.uppercase && passwordChecks.lowercase
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.uppercase && passwordChecks.lowercase
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       Upper & lowercase letters
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Confirm New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={securityForm.confirmPassword}
//                 onChange={handleSecurityFormChange}
//                 placeholder="Confirm new password"
//                 className={`mt-1 block w-full rounded-xl border px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
//                   securityForm.confirmPassword
//                     ? securityForm.newPassword === securityForm.confirmPassword
//                       ? "border-green-300 focus:ring-green-500/20 focus:border-green-500"
//                       : "border-red-300 focus:ring-red-500/20 focus:border-red-500"
//                     : "border-gray-200 focus:ring-secondary-500/20 focus:border-secondary-500"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <Button
//             // variant="black"
//             className="w-full"
//             type="submit"
//             // loading={isSubmitting}
//             disabled={
//               !Object.values(passwordChecks).every(Boolean) ||
//               securityForm.newPassword !== securityForm.confirmPassword
//             }
//           >
//             Set Password
//           </Button>
//         </>
//       ) : (
//         <>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Current Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showCurrentPassword ? "text" : "password"}
//                 name="currentPassword"
//                 value={securityForm.currentPassword}
//                 onChange={handleSecurityFormChange}
//                 placeholder="Enter your current password"
//                 className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition-colors"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showCurrentPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 name="newPassword"
//                 value={securityForm.newPassword}
//                 onChange={handleSecurityFormChange}
//                 placeholder="Enter new password"
//                 className={`mt-1 block w-full rounded-xl border px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
//                   hasStartedTyping
//                     ? securityForm.newPassword
//                       ? Object.values(passwordChecks).every(Boolean)
//                         ? "border-green-300 focus:ring-green-500/20 focus:border-green-500"
//                         : "border-red-300 focus:ring-red-500/20 focus:border-red-500"
//                       : "border-gray-200 focus:ring-secondary-500/20 focus:border-secondary-500"
//                     : "border-gray-200 focus:ring-secondary-500/20 focus:border-secondary-500"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showNewPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {hasStartedTyping && (
//               <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700">
//                     Password strength
//                   </span>
//                   <span
//                     className={`text-xs font-medium ${
//                       Object.values(passwordChecks).filter(Boolean).length === 0
//                         ? "text-gray-400"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 2
//                         ? "text-red-500"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 4
//                         ? "text-yellow-500"
//                         : "text-green-500"
//                     }`}
//                   >
//                     {Object.values(passwordChecks).filter(Boolean).length === 0
//                       ? "Too weak"
//                       : Object.values(passwordChecks).filter(Boolean).length <=
//                         2
//                       ? "Weak"
//                       : Object.values(passwordChecks).filter(Boolean).length <=
//                         4
//                       ? "Medium"
//                       : "Strong"}
//                   </span>
//                 </div>

//                 <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full transition-all duration-300 ${
//                       Object.values(passwordChecks).filter(Boolean).length === 0
//                         ? "w-0 bg-gray-300"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 2
//                         ? "w-1/3 bg-red-500"
//                         : Object.values(passwordChecks).filter(Boolean)
//                             .length <= 4
//                         ? "w-2/3 bg-yellow-500"
//                         : "w-full bg-green-500"
//                     }`}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.length
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.length
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 8 characters
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.number
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.number
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 1 number
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.special
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.special
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 1 special character
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
//                         passwordChecks.uppercase && passwordChecks.lowercase
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-100 text-gray-300"
//                       }`}
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <span
//                       className={`text-sm ${
//                         passwordChecks.uppercase && passwordChecks.lowercase
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       Upper & lowercase letters
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Confirm New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={securityForm.confirmPassword}
//                 onChange={handleSecurityFormChange}
//                 placeholder="Confirm new password"
//                 className={`mt-1 block w-full rounded-xl border px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
//                   securityForm.confirmPassword
//                     ? securityForm.newPassword === securityForm.confirmPassword
//                       ? "border-green-300 focus:ring-green-500/20 focus:border-green-500"
//                       : "border-red-300 focus:ring-red-500/20 focus:border-red-500"
//                     : "border-gray-200 focus:ring-secondary-500/20 focus:border-secondary-500"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <Button
//             // variant="black"
//             className="w-full"
//             type="submit"
//             // loading={isSubmitting}
//             disabled={
//               !securityForm.currentPassword ||
//               !Object.values(passwordChecks).every(Boolean) ||
//               securityForm.newPassword !== securityForm.confirmPassword
//             }
//           >
//             Update Password
//           </Button>
//         </>
//       )}
//     </form>
//   );

//   return (
//     <div className=" px-1 md:px-6 py-8">
//       <div className=" p-3">
//         <h1 className="text-2xl font-semibold mb-6">Settings</h1>

//         <div className="border-b border-gray-200 mb-6 -mx-6 sm:mx-0">
//           <div className="flex flex-wrap gap-1 sm:gap-2 px-6 sm:px-0">
//             <Tab
//               label="Personal Info"
//               icon={<User className="w-4 h-4" />}
//               isActive={activeTab === "personal"}
//               onClick={() => setActiveTab("personal")}
//             />
//             <Tab
//               label="Payout Details"
//               icon={<Building className="w-4 h-4" />}
//               isActive={activeTab === "payout"}
//               onClick={() => setActiveTab("payout")}
//             />
//             <Tab
//               label="Security"
//               icon={<Lock className="w-4 h-4" />}
//               isActive={activeTab === "security"}
//               onClick={() => setActiveTab("security")}
//             />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6">
//           {activeTab === "personal" && renderPersonalInfo()}
//           {activeTab === "payout" && renderBankInfo()}
//           {activeTab === "security" && renderSecurity()}
//         </div>
//       </div>
//     </div>
//   );
// }

// TODO will work on this later
"use client";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState, useRef, useContext } from "react";
import { Upload, Edit, X } from "lucide-react";
import Image from "next/image";
import EditLogoModal from "@/components/edit-logo-modal";
import { Auths } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
const Step2 = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { formDataBusiness } = useContext(Auths);
  const router = useRouter();

  const handleFileUpload = (file: File) => {
    setError(null);

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setLogoFile(file);
    setLogoUrl(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const submitData = async () => {
    setIsLoading(true);
    console.log("data", {
      ...formDataBusiness,
      image: logoFile,
      imageUrl: logoUrl,
    });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendors/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formDataBusiness,
            image: logoFile,
            imageUrl: logoUrl,
          }),
        }
      );
      if (response.ok) {
        setSuccess("Account created successfully.");
        router.push("/onboarding/success");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred during signup.");
    }
    setIsLoading(false);
  };

  // Handle remove logo
  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto p-4">
      {/* Hidden file input */}
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {/* Logo Circle */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt="Uploaded logo"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <>
              <svg
                className="w-10 h-10 text-gray-400"
                width="63"
                height="63"
                viewBox="0 0 63 63"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.3452 43.3947V36.8652"
                  stroke="#0C0C0C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M47.2885 14.1921C51.638 14.1921 55.1382 17.7181 55.1382 22.0676V30.9211C48.8069 34.6272 40.4425 36.8663 31.3316 36.8663C22.2208 36.8663 13.882 34.6272 7.55078 30.9211V22.0419C7.55078 17.6923 11.0767 14.1921 15.4263 14.1921H47.2885Z"
                  stroke="#0C0C0C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40.3527 14.1808V13.2389C40.3527 10.099 37.8048 7.55103 34.6649 7.55103H28.0248C24.8849 7.55103 22.3369 10.099 22.3369 13.2389V14.1808"
                  stroke="#0C0C0C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.61377 40.3223L8.1002 46.7796C8.42963 51.1317 12.0559 54.4955 16.4183 54.4955H46.2705C50.6329 54.4955 54.2592 51.1317 54.5887 46.7796L55.0751 40.3223"
                  stroke="#0C0C0C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </div>

        {/* Remove button overlay */}
        {logoUrl && (
          <button
            onClick={handleRemoveLogo}
            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
            aria-label="Remove logo"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>

      {/* Upload/Edit Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleUploadClick}
        >
          <Upload className="w-4 h-4" />
          Upload Logo
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsEditModalOpen(true)}
          disabled={!logoUrl}
        >
          <Edit className="w-4 h-4" />
          Edit Logo
        </Button>
      </div>

      <>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
      </>

      {/* Continue Button */}
      <Button
        className="w-full bg-black text-white hover:bg-black/90"
        onClick={() => {
          submitData();
        }}
        disabled={isLoading}
      >
        Continue
      </Button>

      {/* Edit Logo Modal */}
      <EditLogoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleFileUpload}
        currentLogoUrl={logoUrl}
      />
    </div>
  );
};

export default Step2;

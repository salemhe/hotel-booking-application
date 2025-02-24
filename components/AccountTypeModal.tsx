import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Store, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface AccountTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  auth: string;
}

export default function AccountTypeModal({ isOpen, onClose, auth }: AccountTypeModalProps) {
  const [accountType, setAccountType] = useState<"user" | "vendor" | null>(null);
  const [hoveredButton, setHoveredButton] = useState<"user" | "vendor" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (accountType) {
      setIsAnimating(true);
      setTimeout(() => {
        router.push(`/${accountType}-${auth}`);
        onClose();
      }, 600);
    }
  };

  const handleAccountSelect = (type: "user" | "vendor") => {
    setIsAnimating(true);
    setTimeout(() => {
      setAccountType(type);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-8 rounded-3xl shadow-2xl bg-linear-to-b from-white via-white to-gray-50 transform transition-all duration-500">
        <DialogHeader className="mb-8">
          <div className="space-y-4">
            <DialogTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 pb-1">
              Choose Your Journey
            </DialogTitle>
            <p className="text-center text-gray-600 text-lg font-medium">
              Select the account type that matches your needs
            </p>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div
            className={`transform transition-all duration-300 ${
              hoveredButton === "user" ? "scale-[1.02]" : "scale-100"
            } ${isAnimating ? "blur-xs" : ""}`}
            onMouseEnter={() => setHoveredButton("user")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Button
              className={`group w-full h-28 relative overflow-hidden ${
                accountType === "user"
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200"
                  : "bg-white hover:bg-gray-50 hover:shadow-md"
              } rounded-2xl border-2 transition-all duration-500 ${
                accountType === "user" ? "border-blue-400" : "border-gray-200"
              }`}
              onClick={() => handleAccountSelect("user")}
              variant="outline"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${
                    accountType === "user" ? "bg-white/10" : "bg-blue-50"
                  } transition-all duration-300`}>
                    <User className={`w-8 h-8 ${
                      accountType === "user" ? "text-white" : "text-blue-500"
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-xl font-bold ${
                      accountType === "user" ? "text-white" : "text-gray-800"
                    }`}>
                      User Account
                    </h3>
                    <p className={`text-base mt-1 ${
                      accountType === "user" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      Perfect for individual shoppers
                    </p>
                  </div>
                </div>
                {accountType === "user" && (
                  <CheckCircle2 className="w-6 h-6 text-white animate-fadeIn" />
                )}
              </div>
            </Button>
          </div>

          <div
            className={`transform transition-all duration-300 ${
              hoveredButton === "vendor" ? "scale-[1.02]" : "scale-100"
            } ${isAnimating ? "blur-xs" : ""}`}
            onMouseEnter={() => setHoveredButton("vendor")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Button
              className={`group w-full h-28 relative overflow-hidden ${
                accountType === "vendor"
                  ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-200"
                  : "bg-white hover:bg-gray-50 hover:shadow-md"
              } rounded-2xl border-2 transition-all duration-500 ${
                accountType === "vendor" ? "border-emerald-400" : "border-gray-200"
              }`}
              onClick={() => handleAccountSelect("vendor")}
              variant="outline"
            >
              <div className="absolute inset-0 bg-linear-to-r from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${
                    accountType === "vendor" ? "bg-white/10" : "bg-emerald-50"
                  } transition-all duration-300`}>
                    <Store className={`w-8 h-8 ${
                      accountType === "vendor" ? "text-white" : "text-emerald-500"
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-xl font-bold ${
                      accountType === "vendor" ? "text-white" : "text-gray-800"
                    }`}>
                      Vendor Account
                    </h3>
                    <p className={`text-base mt-1 ${
                      accountType === "vendor" ? "text-emerald-100" : "text-gray-500"
                    }`}>
                      For businesses and sellers
                    </p>
                  </div>
                </div>
                {accountType === "vendor" && (
                  <CheckCircle2 className="w-6 h-6 text-white animate-fadeIn" />
                )}
              </div>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleContinue}
            disabled={!accountType}
            className={`w-full p-6 rounded-xl text-lg font-bold transition-all duration-500 ${
              accountType
                ? `bg-linear-to-r ${
                    accountType === "user"
                      ? "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      : "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  } text-white transform hover:scale-[1.02] hover:shadow-lg ${
                    isAnimating ? "scale-95 opacity-80" : ""
                  }`
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {accountType ? (
                <>
                  Get Started <ArrowRight className="w-5 h-5 animate-bounceX" />
                </>
              ) : (
                <>
                  Select an option <Sparkles className="w-5 h-5 animate-pulse" />
                </>
              )}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AccountTypeModalProps {
  isOpen: boolean
  onClose: () => void
  auth: string
}

export function AccountTypeModal({ isOpen, onClose, auth }: AccountTypeModalProps) {
  const [accountType, setAccountType] = useState<"user" | "vendor" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (accountType) {
      router.push(`/${accountType}-${auth}`)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Account Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={() => setAccountType("user")} variant={accountType === "user" ? "default" : "outline"}>
            User Account
          </Button>
          <Button onClick={() => setAccountType("vendor")} variant={accountType === "vendor" ? "default" : "outline"}>
            Vendor Account
          </Button>
        </div>
        <Button onClick={handleContinue} disabled={!accountType}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  )
}


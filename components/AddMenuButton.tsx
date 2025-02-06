"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuUploadForm } from "./MenuUploadForm"

export default function AddMenuButton() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({});

    useEffect(() => {
      const savedFormData = localStorage.getItem("menuFormData");
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }, []);

  return (
    <div className="flex items-center justify-center w-full">
      {!isFormOpen && <Button onClick={() => setIsFormOpen(true)}>Add a Menu Item</Button>}
      {isFormOpen && <MenuUploadForm setFormData={setFormData} formData={formData} onClose={() => setIsFormOpen(false)} />}
    </div>
  )
}


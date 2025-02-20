"use client"

import { useEffect, useState } from "react"
import { MenuUploadForm } from "@/components/MenuUploadForm";

export default function AddMenuButton() {
  const [formData, setFormData] = useState({});

    useEffect(() => {
      const savedFormData = localStorage.getItem("menuFormData");
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }, []);

  return (
    <div className="flex items-center justify-center w-full max-w-screen-sm mx-auto my-10 px-4">
      <MenuUploadForm setFormData={setFormData} formData={formData} />
    </div>
  )
}


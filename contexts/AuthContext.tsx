"use client"
import React, { createContext, useState } from 'react';

interface AuthInitials {
  email: string;
  password: string;
}

type FormData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

interface auth {
  authInitials: AuthInitials | null;
  setAuthInitials: React.Dispatch<React.SetStateAction<AuthInitials | null>>;
  formData: FormData | null;
  updateFormData: (data: Partial<FormData | null>) => void;
}


export const Auths = createContext<auth>({
  authInitials: null,
  setAuthInitials: () => {},
  formData: null,
  updateFormData: () => {}
}
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authInitials, setAuthInitials] = useState<AuthInitials | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const updateFormData = (data: Partial<FormData | null>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };

  return (
    <Auths.Provider value={{ authInitials, setAuthInitials, formData, updateFormData }}>
      {children}
    </Auths.Provider>
  );
};

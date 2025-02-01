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
  formDataBusiness: FormData | null;
  updateFormDataBusiness: (data: Partial<FormData | null>) => void;
  formDataPersonal: FormData | null;
  updateFormDataPersonal: (data: Partial<FormData | null>) => void;
}


export const Auths = createContext<auth>({
  authInitials: null,
  setAuthInitials: () => {},
  formDataBusiness: null,
  updateFormDataBusiness: () => {},
  formDataPersonal: null,
  updateFormDataPersonal: () => {}
}
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authInitials, setAuthInitials] = useState<AuthInitials | null>(null);
  const [formDataBusiness, setFormDataBusiness] = useState<FormData | null>(null);
  const [formDataPersonal, setFormDataPersonal] = useState<FormData | null>(null);

  const updateFormDataBusiness = (data: Partial<FormData | null>) => {
    setFormDataBusiness((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };
  const updateFormDataPersonal = (data: Partial<FormData | null>) => {
    setFormDataPersonal((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };

  return (
    <Auths.Provider value={{ authInitials, setAuthInitials, formDataBusiness, formDataPersonal, updateFormDataBusiness, updateFormDataPersonal}}>
      {children}
    </Auths.Provider>
  );
};

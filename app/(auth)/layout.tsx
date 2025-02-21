import React from 'react';
import "../globals.css";

interface AuthLayoutProps {
   children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
   return (
      <div className="auth-layout">
         <main>{children}</main>
      </div>
   );
};

export default AuthLayout;
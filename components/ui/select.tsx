"use client";
import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={
        "block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm " +
        (props.className || "")
      }
    >
      {children}
    </select>
  );
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function SelectTrigger({ children, ...props }: SelectTriggerProps) {
  return (
    <div
      {...props}
      className={
        "flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer " +
        (props.className || "")
      }
    >
      {children}
    </div>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
}
export function SelectContent({ children }: SelectContentProps) {
  return <div className="bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">{children}</div>;
}

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}
export function SelectItem({ children, ...props }: SelectItemProps) {
  return <option {...props}>{children}</option>;
}

interface SelectValueProps {
  placeholder?: string;
  value?: string;
}
export function SelectValue({ placeholder, value }: SelectValueProps) {
  return <span>{value || placeholder}</span>;
}

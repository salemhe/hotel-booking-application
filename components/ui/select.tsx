"use client";
import * as React from "react";

// Simple native select for standard HTML select dropdowns
export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function NativeSelect({ children, className, ...props }: NativeSelectProps) {
  return (
    <select
      className={`block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
}

// Custom select component for more complex UI
interface SelectProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function Select({ children, defaultValue, className, onChange }: SelectProps) {
  // Use state to track the selected value
  const [value, setValue] = React.useState(defaultValue || "");
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Reference to the container element for handling outside clicks
  const selectRef = React.useRef<HTMLDivElement>(null);// Get option children to display the value
  const options = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => React.isValidElement(child) && child.type === SelectItem)
    .map((child: React.ReactElement) => ({
      value: (child.props as any).value,
      label: (child.props as any).children
    }));
    
  const selectedLabel = options.find(option => option.value === value)?.label || "";
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle selection
  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };
  
  return (
    <div ref={selectRef} className={`relative inline-block ${className || ''}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer"
      >
        {selectedLabel || <span className="text-gray-400">Select an option</span>}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">{options.map((option: { value: string; label: React.ReactNode }) => (
            <div 
              key={option.value} 
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
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
}interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  return <div className="bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">{children}</div>;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}
export function SelectItem({ children, value }: SelectItemProps) {
  // This is just a placeholder component for the structure
  // The actual rendering is handled by Select component
  return null;
}

interface SelectValueProps {
  placeholder?: string;
  value?: string;
}
export function SelectValue({ placeholder, value }: SelectValueProps) {
  return <span>{value || placeholder}</span>;
}// Second SelectContent component is not needed - it's already defined above

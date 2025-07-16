"use client";
import * as React from "react";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function RadioGroup({ value, onValueChange, children, ...props }: RadioGroupProps) {
  return (
    <div role="radiogroup" {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === RadioGroupItem) {
          const radioChild = child as React.ReactElement<RadioGroupItemProps, typeof RadioGroupItem>;
          return React.cloneElement(radioChild, {
            checked: value === radioChild.props.value,
            onChange: () => onValueChange(radioChild.props.value),
            name: props.id || "radio-group",
          });
        }
        return child;
      })}
    </div>
  );
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id?: string;
  name?: string;
}

export function RadioGroupItem({ value, checked, onChange, id, ...props }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      id={id}
      className="form-radio text-teal-600 focus:ring-teal-500 h-4 w-4 border-gray-300"
      {...props}
    />
  );
}

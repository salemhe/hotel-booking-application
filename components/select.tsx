import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

export function Select({ children, ...props }: SelectPrimitive.SelectProps) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

export function SelectTrigger({ className, children, ...props }: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={`border rounded-md px-3 py-2 w-full ${className}`}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

export function SelectValue({ className, ...props }: SelectPrimitive.SelectValueProps) {
  return <SelectPrimitive.Value className={className} {...props} />;
}

export function SelectContent({ className, children, ...props }: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={`bg-white border rounded-md shadow-md p-2 ${className}`}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={`px-3 py-2 hover:bg-gray-100 rounded-md ${className}`}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
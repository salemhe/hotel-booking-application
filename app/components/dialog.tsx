import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface DialogProps extends DialogPrimitive.DialogProps {}

export function Dialog({ children, ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

interface DialogTriggerProps extends DialogPrimitive.DialogTriggerProps {}

export function DialogTrigger({ className, children, ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger className={className} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}

interface DialogContentProps extends DialogPrimitive.DialogContentProps {}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg max-w-md w-full ${className}`}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

interface DialogTitleProps extends DialogPrimitive.DialogTitleProps {}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <DialogPrimitive.Title className={`text-lg font-semibold ${className}`} {...props} />;
}
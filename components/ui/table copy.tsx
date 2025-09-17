"use client";
import * as React from "react";

export function Table({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200" {...props}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-gray-50" {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="bg-white divide-y divide-gray-200" {...props}>{children}</tbody>;
}

export function TableRow({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props}>{children}</tr>;
}

export function TableHead({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>{children}</th>;
}

export function TableCell({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props}>{children}</td>;
}

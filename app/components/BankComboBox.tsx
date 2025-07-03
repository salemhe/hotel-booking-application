"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"

interface Bank {
  code: string
  name: string
}

interface BankComboboxProps {
  banks: Bank[]
  value: string
  onChange: (value: string, code: string) => void
  isLoading?: boolean
  retry: () => void
}

export function BankCombobox({ banks, value, onChange, isLoading = false, retry }: BankComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 rounded-md"
            disabled={isLoading}
            type="button"
          >
            {isLoading
              ? "Loading banks..."
              : value
                ? banks.find((bank) => bank.code === value)?.name || "Select Bank"
                : "Select Bank"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search bank..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-4">
              <span>No bank found.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                disabled={isLoading}
              >
                {isLoading ? "Loading banks..." : "Retry"}
              </Button>
              </div>
            </CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {banks.map((bank, i) => (
                <CommandItem
                  key={i}
                  value={bank.name}
                  onSelect={() => {
                    onChange(bank.name, bank.code)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === bank.code ? "opacity-100" : "opacity-0")} />
                  {bank.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


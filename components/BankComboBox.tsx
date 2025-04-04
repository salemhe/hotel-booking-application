"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl } from "@/components/ui/form"

interface Bank {
  code: string
  name: string
}

interface BankComboboxProps {
  banks: Bank[]
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export function BankCombobox({ banks, value, onChange, isLoading = false }: BankComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 rounded-md"
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
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search bank..." />
          <CommandList>
            <CommandEmpty>No bank found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {banks.map((bank, i) => (
                <CommandItem
                  key={i}
                  value={bank.name}
                  onSelect={() => {
                    onChange(bank.code)
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


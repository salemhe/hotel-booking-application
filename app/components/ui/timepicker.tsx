// components/TimePicker.tsx
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"
import { Label } from "./label"

const generateTimes = (interval = 30) => {
  const times: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minutes = 0; minutes < 60; minutes += interval) {
      const h = hour.toString().padStart(2, "0")
      const m = minutes.toString().padStart(2, "0")
      times.push(`${h}:${m}`)
    }
  }
  return times
}

export function TimePicker({ value, onChange }: {
  value?: string
  onChange?: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const times = generateTimes(30) // 30-minute intervals

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] flex-col items-start rounded-xl px-6 min-w-[150px] flex h-[60px]",
                            !value && "text-muted-foreground"
        )}>
            <Label  htmlFor="date" className="text-black">Available Time</Label>
          {value ? value : "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[200px] w-[140px] overflow-auto p-0">
        <div className="flex flex-col">
          {times.map((time) => (
            <Button
              key={time}
              variant="ghost"
              className={cn("justify-start w-full text-left rounded-none", {
                "bg-muted": value === time
              })}
              onClick={() => {
                onChange?.(time)
                setOpen(false)
              }}
            >
              {time}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

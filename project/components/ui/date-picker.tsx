"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  mode?: "single" | "range";
}

export function DatePicker({ selected, onSelect, mode = "range" }: DatePickerProps) {
  return (
    <div className="grid gap-2">
      <Calendar
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        locale={ptBR}
        className="rounded-md border-purple-500/20 bg-black/40"
        classNames={{
          head_cell: "text-purple-200/60 font-medium text-xs",
          cell: cn(
            "h-8 w-8 text-center text-xs p-0 relative",
            "hover:bg-purple-500/20 focus-within:relative focus-within:z-20"
          ),
          day: cn(
            "h-8 w-8 p-0 font-normal text-purple-200/80 text-xs",
            "hover:bg-purple-500/20 hover:text-purple-100",
            "focus:bg-purple-500/20 focus:text-purple-100"
          ),
          day_selected: "bg-purple-500/30 text-purple-100 hover:bg-purple-500/40",
          day_today: "bg-purple-500/10 text-purple-100",
          day_outside: "text-purple-200/40",
          day_disabled: "text-purple-200/20",
          day_range_middle: "aria-selected:bg-purple-500/20",
          day_hidden: "invisible",
          nav_button: cn(
            "border border-purple-500/20 bg-black/40",
            "hover:bg-purple-500/20 hover:text-purple-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          caption: "relative h-8 flex items-center justify-center text-purple-100 text-sm",
        }}
      />
    </div>
  );
}
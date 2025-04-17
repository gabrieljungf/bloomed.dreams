"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
}

export function DateRangePicker({ selected, onSelect }: DateRangePickerProps) {
  const startDate = selected?.[0];
  const endDate = selected?.[1];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-purple-200/80">Start Date</Label>
          <Input
            value={startDate ? format(startDate, 'MMM dd, yyyy') : ''}
            readOnly
            className="bg-black/40 border-purple-500/20 text-purple-100 text-xs h-8"
            placeholder="Select start date"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-purple-200/80">End Date</Label>
          <Input
            value={endDate ? format(endDate, 'MMM dd, yyyy') : ''}
            readOnly
            className="bg-black/40 border-purple-500/20 text-purple-100 text-xs h-8"
            placeholder="Select end date"
          />
        </div>
      </div>
      
      <Calendar
        mode="range"
        selected={selected}
        onSelect={onSelect}
        numberOfMonths={1}
        className="rounded-md border-purple-500/20 bg-black/40"
        classNames={{
          head_row: "flex",
          head_cell: "text-purple-200/60 font-medium text-xs w-9 text-center",
          row: "flex w-full",
          cell: "w-9 h-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-500/20",
          day: "h-9 w-9 p-0 font-normal text-purple-200/80",
          day_range_start: "rounded-l-md bg-purple-500/30",
          day_range_end: "rounded-r-md bg-purple-500/30",
          day_selected: "bg-purple-500/30 text-purple-100 hover:bg-purple-500/40",
          day_today: "bg-purple-500/10 text-purple-100",
          day_outside: "text-purple-200/40",
          day_disabled: "text-purple-200/20",
          day_range_middle: "bg-purple-500/20",
          day_hidden: "invisible",
          nav_button: "border border-purple-500/20 bg-black/40 hover:bg-purple-500/20",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          caption: "relative h-9 flex items-center justify-center text-purple-100",
        }}
      />
    </div>
  );
}
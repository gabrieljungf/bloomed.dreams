"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar"; // Este é o DayPicker
import { ptBR } from 'date-fns/locale';
import type { Locale } from 'date-fns'; // <--- IMPORTAR Locale
import {
  DateRange,
  SelectSingleEventHandler,
  SelectRangeEventHandler,
  DayPickerProps // <--- IMPORTAR DayPickerProps para os tipos de classNames
} from 'react-day-picker';

// Tipos base para props que não mudam com o mode
type DatePickerBaseProps = {
  locale?: Locale; // Agora 'Locale' é conhecido
  className?: string;
  classNames?: DayPickerProps['classNames']; // <--- Usar DayPickerProps['classNames']
  // Adicione outras props do DayPicker que você quer expor e que não dependem do mode
  // como initialFocus, numberOfMonths, etc.
};

// Tipos condicionais para selected e onSelect baseados no mode
type ConditionalProps<TMode extends "single" | "range" | "multiple" | "default" | undefined> =
  TMode extends "single" ? {
    mode: TMode;
    selected?: Date;
    onSelect?: SelectSingleEventHandler;
  } :
  TMode extends "range" ? {
    mode: TMode;
    selected?: DateRange;
    onSelect?: SelectRangeEventHandler;
  } :
  // Adicionar "multiple" se você for usá-lo
  // TMode extends "multiple" ? {
  //   mode: TMode;
  //   selected?: Date[];
  //   onSelect?: SelectMultipleEventHandler;
  // } :
  {
    mode?: TMode;
    selected?: Date;
    onSelect?: SelectSingleEventHandler;
  };

// Combina os tipos base com os condicionais
export type DatePickerProps = DatePickerBaseProps & (
  ConditionalProps<"single"> |
  ConditionalProps<"range">
  // | ConditionalProps<"multiple">
  // | ConditionalProps<"default">
);

export function DatePicker({ mode = "single", selected, onSelect, ...props }: DatePickerProps) {
  // Se o seu default real é 'range', você pode ajustar a assinatura da função ou o valor padrão de 'mode'.
  // Por exemplo, para default 'range':
  // export function DatePicker({ mode = "range" as "range", selected, onSelect, ...props }: DatePickerProps) {
  // Ou, se este componente SÓ lida com 'range':
  // export function DatePicker({ mode = "range", selected, onSelect, ...props }: ConditionalProps<"range"> & DatePickerBaseProps) {

  return (
    <div className="grid gap-2">
      <Calendar
        mode={mode}
        // @ts-ignore - Se os tipos condicionais complexos ainda causarem problemas aqui.
        // O objetivo é que esta linha não precise de ignore quando os tipos estiverem perfeitos.
        selected={selected as any} // Temporário, idealmente os tipos se alinham
        onSelect={onSelect as any}   // Temporário, idealmente os tipos se alinham
        locale={props.locale || ptBR} // Usa a prop locale ou ptBR como fallback
        className={cn("rounded-md border-purple-500/20 bg-black/40", props.className)}
        classNames={{ // Mescla os classNames passados com os defaults internos
          head_cell: cn("text-purple-200/60 font-medium text-xs", props.classNames?.head_cell),
          cell: cn(
            "h-8 w-8 text-center text-xs p-0 relative",
            "hover:bg-purple-500/20 focus-within:relative focus-within:z-20",
            props.classNames?.cell
          ),
          day: cn(
            "h-8 w-8 p-0 font-normal text-purple-200/80 text-xs",
            "hover:bg-purple-500/20 hover:text-purple-100",
            "focus:bg-purple-500/20 focus:text-purple-100",
            props.classNames?.day
          ),
          day_selected: cn("bg-purple-500/30 text-purple-100 hover:bg-purple-500/40", props.classNames?.day_selected),
          day_today: cn("bg-purple-500/10 text-purple-100", props.classNames?.day_today),
          day_outside: cn("text-purple-200/40", props.classNames?.day_outside),
          day_disabled: cn("text-purple-200/20", props.classNames?.day_disabled),
          day_range_middle: cn("aria-selected:bg-purple-500/20", props.classNames?.day_range_middle),
          day_hidden: cn("invisible", props.classNames?.day_hidden),
          nav_button: cn(
            "border border-purple-500/20 bg-black/40",
            "hover:bg-purple-500/20 hover:text-purple-100",
            props.classNames?.nav_button
          ),
          nav_button_previous: cn("absolute left-1", props.classNames?.nav_button_previous),
          nav_button_next: cn("absolute right-1", props.classNames?.nav_button_next),
          caption: cn("relative h-8 flex items-center justify-center text-purple-100 text-sm", props.classNames?.caption),
          ...props.classNames, // Garante que quaisquer outros classNames passados sejam aplicados
        }}
        {...props} // Passa quaisquer outras props DayPicker válidas não explicitamente tratadas
      />
    </div>
  );
}
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type RuledInputProps = {
  title: string;
  placeholder: string;
  hintText: string;
  value: string;
  setValue: (v: string) => void;
  rule: { min: number; max: number };
  earlyShowError?: boolean;
};

export default function RuledInput({
  title,
  placeholder,
  hintText,
  value,
  setValue,
  rule,
  earlyShowError,
}: RuledInputProps) {
  const [touched, setTouched] = useState(false);
  const trimmedLen = value.trim().length;

  const inputIsInvalid = earlyShowError
    ? trimmedLen > 0 && (trimmedLen < rule.min || trimmedLen > rule.max)
    : touched && (trimmedLen < rule.min || trimmedLen > rule.max);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > rule.max) {
      toast.error("Input too long", {
        description: `Length: ${e.target.value.length}, Maximum allowed ${rule.max}`,
      });
      return;
    }
    setValue(e.target.value);
  };

  return (
    <div className="space-y-1.5">
      <Label>
        {title} <span className="text-destructive">*</span>
      </Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        aria-invalid={inputIsInvalid}
        className={cn(inputIsInvalid && "border-destructive")}
      />
      {inputIsInvalid && (
        <p className="text-[12.5px] text-destructive">
          {trimmedLen < rule.min &&
            `Length: ${trimmedLen}, Minimum allowed ${rule.min}`}
          {trimmedLen > rule.max &&
            `Length: ${trimmedLen}, Maximum allowed ${rule.max}`}
        </p>
      )}
      <p className="text-[12.5px] text-muted-foreground">
        Length: {trimmedLen} ({hintText})
      </p>
    </div>
  );
}

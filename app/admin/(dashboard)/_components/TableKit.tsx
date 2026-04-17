"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function BoolCell({
  value,
  label,
}: {
  value: boolean;
  label?: { on: string; off: string };
}) {
  const on = label?.on ?? "Active";
  const off = label?.off ?? "Inactive";
  return (
    <Badge
      variant={value ? "default" : "secondary"}
      className={cn(
        "font-mono text-[10px] uppercase tracking-wider",
        value
          ? "bg-muted text-foreground hover:bg-muted/80"
          : "bg-muted text-muted-foreground hover:bg-muted",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mr-1 inline-block size-1.5 rounded-full",
          value ? "bg-foreground" : "bg-muted-foreground/40",
        )}
      />
      {value ? on : off}
    </Badge>
  );
}

export function RowActions({
  editHref,
  onDelete,
  deleting,
}: {
  editHref?: string;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      {editHref && (
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <Link href={editHref} aria-label="Edit">
            <Pencil className="size-3.5" />
          </Link>
        </Button>
      )}
      {onDelete && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete"
              className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete item?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

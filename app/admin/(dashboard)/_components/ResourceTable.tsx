"use client";

import Link from "next/link";
import { Pencil, Trash2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right";
};

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
          ? "bg-accent/15 text-accent hover:bg-accent/20"
          : "bg-muted text-muted-foreground hover:bg-muted"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mr-1 inline-block size-1.5 rounded-full",
          value ? "bg-accent" : "bg-muted-foreground/40"
        )}
      />
      {value ? on : off}
    </Badge>
  );
}

export default function ResourceTable<T extends { id: number }>({
  rows,
  columns,
  editHref,
  onDelete,
  deleting,
  emptyLabel = "No records yet",
}: {
  rows: T[];
  columns: Column<T>[];
  editHref?: (row: T) => string;
  onDelete?: (id: number) => void;
  deleting?: boolean;
  emptyLabel?: string;
}) {
  const [target, setTarget] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
                    c.align === "right" && "text-right"
                  )}
                >
                  {c.label}
                </TableHead>
              ))}
              {(editHref || onDelete) && (
                <TableHead className="w-28 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (editHref || onDelete ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="size-6 opacity-50" />
                    <p className="text-sm">{emptyLabel}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/50 transition hover:bg-accent/5"
                >
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(c.align === "right" && "text-right")}
                    >
                      {c.render(row)}
                    </TableCell>
                  ))}
                  {(editHref || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editHref && (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-foreground"
                          >
                            <Link href={editHref(row)} aria-label="Edit">
                              <Pencil className="size-3.5" />
                            </Link>
                          </Button>
                        )}
                        {onDelete && (
                          <Dialog
                            open={target === row.id}
                            onOpenChange={(o) =>
                              setTarget(o ? row.id : null)
                            }
                          >
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
                                <Button
                                  variant="outline"
                                  onClick={() => setTarget(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  disabled={deleting}
                                  onClick={() => {
                                    onDelete(row.id);
                                    setTarget(null);
                                  }}
                                >
                                  {deleting ? "Deleting…" : "Delete"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

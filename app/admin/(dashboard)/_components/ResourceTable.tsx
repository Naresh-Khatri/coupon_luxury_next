"use client";

import Link from "next/link";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
};

export function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle2 className="size-5 text-green-600" />
  ) : (
    <XCircle className="size-5 text-red-500" />
  );
}

export default function ResourceTable<T extends { id: number }>({
  rows,
  columns,
  editHref,
  onDelete,
  deleting,
}: {
  rows: T[];
  columns: Column<T>[];
  editHref?: (row: T) => string;
  onDelete?: (id: number) => void;
  deleting?: boolean;
}) {
  const [target, setTarget] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key}>{c.label}</TableHead>
            ))}
            {(editHref || onDelete) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No records
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.render(row)}</TableCell>
                ))}
                {(editHref || onDelete) && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editHref && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={editHref(row)}>
                            <Pencil className="size-3.5" />
                          </Link>
                        </Button>
                      )}
                      {onDelete && (
                        <Dialog
                          open={target === row.id}
                          onOpenChange={(o) => setTarget(o ? row.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="size-3.5 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete item?</DialogTitle>
                              <DialogDescription>
                                This cannot be undone.
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
                                Delete
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
  );
}

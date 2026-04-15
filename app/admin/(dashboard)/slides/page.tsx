"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { PageHeader } from "../_components/FormKit";
import { BoolCell, RowActions } from "../_components/TableKit";
import { cn } from "@/lib/utils";

type Row = {
  id: number;
  title: string;
  order: number;
  imgURL: string;
  imgAlt: string;
  active: boolean;
  featured: boolean;
};

export default function SlidesAdminPage() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.slides.list.useQuery();
  const [rows, setRows] = React.useState<Row[]>([]);

  React.useEffect(() => {
    if (data) setRows(data as Row[]);
  }, [data]);

  const del = trpc.admin.slides.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.slides.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const reorder = trpc.admin.slides.reorder.useMutation({
    onSuccess: () => utils.admin.slides.list.invalidate(),
    onError: () => {
      toast.error("Reorder failed");
      utils.admin.slides.list.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(rows, oldIndex, newIndex).map((r, i) => ({
      ...r,
      order: i + 1,
    }));
    setRows(next);
    reorder.mutate(next.map((r) => ({ id: r.id, order: r.order })));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Slides"
        description="Drag rows to reorder the homepage hero carousel."
        actions={
          <Button asChild>
            <Link href="/admin/slides/new">
              <Plus className="size-4" /> Add slide
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-[40px_100px_1fr_110px_110px_90px] items-center gap-3 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
          <span className="sr-only">Drag</span>
          <span>Image</span>
          <span>Title</span>
          <span>Status</span>
          <span>Featured</span>
          <span className="text-right">Actions</span>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No slides.</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={rows.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {rows.map((r) => (
                  <SortableSlideRow
                    key={r.id}
                    row={r}
                    onDelete={() => del.mutate(r.id)}
                    deleting={del.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

function SortableSlideRow({
  row,
  onDelete,
  deleting,
}: {
  row: Row;
  onDelete: () => void;
  deleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid grid-cols-[40px_100px_1fr_110px_110px_90px] items-center gap-3 border-b bg-background px-3 py-2 last:border-b-0",
        isDragging && "z-10 shadow-md",
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="flex size-8 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <Image
        src={row.imgURL}
        alt={row.imgAlt}
        width={80}
        height={40}
        className="rounded border border-border/60"
      />
      <span className="font-medium">{row.title}</span>
      <BoolCell value={row.active} />
      <BoolCell
        value={row.featured}
        label={{ on: "Featured", off: "Normal" }}
      />
      <RowActions
        editHref={`/admin/slides/${row.id}`}
        onDelete={onDelete}
        deleting={deleting}
      />
    </div>
  );
}

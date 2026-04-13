"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";

export default function BackgroundVideoPage() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.video.get.useQuery();
  const [url, setUrl] = useState("");

  const save = trpc.admin.video.set.useMutation({
    onSuccess: () => {
      toast.success("Saved");
      utils.admin.video.get.invalidate();
      setUrl("");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-2xl font-bold">Background Video</h1>
      <p className="text-sm text-muted-foreground">
        Current:{" "}
        {isLoading
          ? "loading…"
          : data?.url ? (
              <a href={data.url} className="text-blue-600 underline">
                {data.url}
              </a>
            ) : (
              "none"
            )}
      </p>
      <div className="space-y-1.5">
        <Label>New video URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <Button
        disabled={!url || save.isPending}
        onClick={() => save.mutate({ url })}
      >
        Save
      </Button>
    </div>
  );
}

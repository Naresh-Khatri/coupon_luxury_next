"use client";

import Link from "next/link";
import {
  Store,
  Tag,
  Box,
  Ticket,
  Newspaper,
  ArrowUpRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatNumber = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function AdminDashboardPage() {
  const { data, isLoading } = trpc.admin.stats.useQuery();

  const totalOffers = (data?.deals ?? 0) + (data?.coupons ?? 0);

  const secondary = [
    {
      label: "Stores",
      value: data?.stores ?? 0,
      icon: Store,
      href: "/admin/stores",
    },
    {
      label: "Categories",
      value: data?.categories ?? 0,
      icon: Box,
      href: "/admin/categories",
    },
    {
      label: "Blogs",
      value: data?.blogs ?? 0,
      icon: Newspaper,
      href: "/admin/blogs",
    },
  ];

  const split = [
    {
      label: "Deals",
      value: data?.deals ?? 0,
      icon: Tag,
      share:
        totalOffers > 0 ? Math.round(((data?.deals ?? 0) / totalOffers) * 100) : 0,
    },
    {
      label: "Coupons",
      value: data?.coupons ?? 0,
      icon: Ticket,
      share:
        totalOffers > 0
          ? Math.round(((data?.coupons ?? 0) / totalOffers) * 100)
          : 0,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="size-3 text-accent" />
          Operations console
        </span>
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          Good to see you back.
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          A live summary of the catalog, content, and audience powering
          CouponLuxury.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-border/60 bg-gradient-to-br from-card to-accent/5 overflow-hidden relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-accent/10 blur-3xl"
          />
          <CardContent className="relative flex flex-col gap-6 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Total live offers
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Deals and coupons across all stores
                </p>
              </div>
              <Link
                href="/admin/offers"
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                View all <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-7xl font-semibold leading-none tabular-nums md:text-8xl">
                {isLoading ? "—" : formatNumber(totalOffers)}
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                active
              </span>
            </div>

            <div className="space-y-2.5">
              {split.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <row.icon className="size-4 text-muted-foreground" />
                  <span className="w-20 text-sm font-medium">{row.label}</span>
                  <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          row.label === "Deals" ? "bg-primary" : "bg-accent"
                        )}
                        style={{ width: `${row.share}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-20 text-right font-mono text-sm tabular-nums">
                    {isLoading ? "—" : formatNumber(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Quick actions
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Jump straight into creation.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild size="sm" className="justify-start">
                <Link href="/admin/offers/new">
                  <Plus className="size-4" /> New offer
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="justify-start"
              >
                <Link href="/admin/stores/new">
                  <Plus className="size-4" /> New store
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="justify-start"
              >
                <Link href="/admin/blogs/new">
                  <Plus className="size-4" /> New blog post
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="justify-start"
              >
                <Link href="/admin/slides/new">
                  <Plus className="size-4" /> New slide
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {secondary.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-border/60 bg-card p-5 transition hover:border-accent/40 hover:bg-accent/5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {stat.label}
              </p>
              <stat.icon className="size-4 text-muted-foreground transition group-hover:text-accent" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-4xl font-semibold tabular-nums">
                {isLoading ? "—" : formatNumber(stat.value)}
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground/50 transition group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

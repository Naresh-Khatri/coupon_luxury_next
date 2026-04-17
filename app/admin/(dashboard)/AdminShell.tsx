"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { cn } from "@/lib/utils";
import AppSidebar from "./AppSidebar";

const THEME_KEY = "admin-theme";

function toTitle(seg: string): string {
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const segs = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [
    { label: "Admin", href: "/admin" },
  ];
  if (segs.length <= 1) return crumbs;
  let href = "/admin";
  for (let i = 1; i < segs.length; i++) {
    href += `/${segs[i]}`;
    const isLast = i === segs.length - 1;
    crumbs.push({
      label: toTitle(decodeURIComponent(segs[i])),
      href: isLast ? undefined : href,
    });
  }
  return crumbs;
}

export default function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(THEME_KEY) === "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div
      className={cn(
        "h-svh bg-background text-foreground font-sans",
        isDark && "dark"
      )}
    >
      <SidebarProvider className="h-svh !min-h-0 overflow-hidden">
        <AppSidebar user={user} />
        <SidebarInset className="flex min-h-0 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-1 h-4" />
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-sm">
                  {breadcrumbs.map((crumb, i) => {
                    const isLast = i === breadcrumbs.length - 1;
                    return (
                      <li key={i} className="flex items-center gap-1.5">
                        {i > 0 && (
                          <ChevronRight
                            className="size-3.5 text-muted-foreground/60"
                            aria-hidden
                          />
                        )}
                        {crumb.href && !isLast ? (
                          <Link
                            href={crumb.href}
                            className="text-muted-foreground transition hover:text-foreground"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span
                            aria-current={isLast ? "page" : undefined}
                            className="font-medium text-foreground"
                          >
                            {crumb.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            <AnimatedThemeToggler
              isDark={isDark}
              onToggle={setIsDark}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </header>

          <div className="p-4 md:p-6 overflow-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

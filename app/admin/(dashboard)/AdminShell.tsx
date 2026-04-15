"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Store,
  Tag,
  Box,
  Boxes,
  Newspaper,
  Images,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronsUpDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: typeof Store };
type NavSection = { label: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/stores", label: "Stores", icon: Store },
      { href: "/admin/offers", label: "Offers", icon: Tag },
      { href: "/admin/categories", label: "Categories", icon: Box },
      { href: "/admin/subcategories", label: "Subcategories", icon: Boxes },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
      { href: "/admin/slides", label: "Slides", icon: Images },
    ],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    ],
  },
];

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(THEME_KEY) === "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/admin/login");
  }

  const breadcrumbs = getBreadcrumbs(pathname);
  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex min-h-screen bg-background text-foreground font-sans",
        isDark && "dark"
      )}
    >
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="close menu"
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link
            href="/admin"
            className="flex items-baseline gap-1.5 font-display text-xl leading-none"
          >
            <span className="font-semibold italic">CL</span>
            <span className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/60">
              Admin
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="space-y-6 p-3">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/40">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full transition-opacity",
                          active
                            ? "bg-sidebar-primary opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <item.icon
                        className={cn(
                          "size-4 transition",
                          active
                            ? "text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/60"
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/80 px-4 text-card-foreground backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md p-1 transition hover:bg-accent hover:text-accent-foreground md:hidden"
              onClick={() => setOpen(true)}
              aria-label="menu"
            >
              <Menu className="size-5" />
            </button>
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

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler
              isDark={isDark}
              onToggle={setIsDark}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs font-semibold leading-tight">
                      {user.name}
                    </span>
                    <span className="block text-[11px] leading-tight text-muted-foreground">
                      {user.email}
                    </span>
                  </span>
                  <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

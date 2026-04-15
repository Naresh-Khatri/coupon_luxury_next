"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { authClient } from "@/lib/auth-client";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/categories", label: "Categories", icon: Box },
  { href: "/admin/subcategories", label: "Subcategories", icon: Boxes },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/slides", label: "Slides", icon: Images },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

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
  const rootRef = useRef<HTMLDivElement>(null);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/admin/login");
  }

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform md:static md:translate-x-0 dark:bg-neutral-900 dark:shadow-black/40 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-6 dark:border-neutral-800">
          <Link href="/admin" className="text-lg font-bold">
            CL Admin
          </Link>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="p-3">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-brand-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <AnimatedThemeToggler
              targetRef={rootRef}
              className="inline-flex size-9 items-center justify-center rounded-md border text-gray-700 transition hover:bg-gray-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
            />
            <div className="text-right text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {user.email}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

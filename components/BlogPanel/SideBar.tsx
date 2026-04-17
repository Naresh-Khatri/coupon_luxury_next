"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTES: { name: string; route: string; Icon: LucideIcon }[] = [
  { name: "All Blogs", route: "/blogs/admin", Icon: ListChecks },
  { name: "Create Blog", route: "/blogs/admin/create", Icon: Plus },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-1/4 max-w-xs">
      <div className="flex justify-center bg-[#0072a0] py-5">
        <Link href="https://www.couponluxury.com/" title="Home">
          <Image
            src="https://ik.imagekit.io/couponluxury/tr:w-200:h-100/main_logo_noj4ZyPyq"
            alt="CouponLuxury logo"
            width={160}
            height={80}
          />
        </Link>
      </div>
      <hr className="border-gray-300" />
      <nav className="mt-10 ml-5 flex flex-col">
        {ROUTES.map((route) => {
          const active = pathname === route.route;
          return (
            <Link key={route.name} href={route.route}>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-between pr-0 text-left hover:bg-black/5"
              >
                <div className="flex items-center">
                  <route.Icon
                    className="size-5"
                    color={active ? "#0072a0" : "#718096"}
                  />
                  <span
                    className={cn(
                      "ml-3",
                      active ? "font-bold text-brand-900" : "text-gray-500"
                    )}
                  >
                    {route.name}
                  </span>
                </div>
                <div
                  className={cn(
                    "h-9 w-1 rounded",
                    active ? "bg-brand-900" : "bg-transparent"
                  )}
                />
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

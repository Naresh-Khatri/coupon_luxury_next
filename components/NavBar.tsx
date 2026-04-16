"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu as MenuIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SearchTrigger from "./SearchTrigger";
import CountrySelector from "./CountrySelector";
import { cn } from "@/lib/utils";
import transformPath from "@/utils/transformImagePath";

type FeaturedStore = {
  id: string | number;
  slug: string;
  storeName: string;
  image: string;
};
type FeaturedCategory = {
  id: string | number;
  slug: string;
  categoryName: string;
};

const mobileLinks = [
  { name: "Home", slug: "/" },
  { name: "Stores", slug: "/stores" },
  { name: "Categories", slug: "/categories" },
  { name: "Deals", slug: "/deals" },
  { name: "Blogs", slug: "/blogs" },
];

const navTriggerCls = (active: boolean) =>
  cn(
    "relative h-9 rounded-none bg-transparent px-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors",
    "hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white",
    "data-[state=open]:bg-transparent data-[state=open]:text-gold",
    "after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:ease-out",
    "hover:after:scale-x-100 data-[state=open]:after:scale-x-100",
    active ? "text-gold after:scale-x-100" : "text-white/75"
  );

function StoresPanel({ stores }: { stores: FeaturedStore[] }) {
  return (
    <div className="w-[440px]">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          Featured stores
        </span>
        <NavigationMenuLink asChild>
          <Link
            href="/stores"
            className="rounded-sm p-0 text-[11px] font-medium text-white/60 transition-colors hover:!bg-transparent hover:!text-gold"
          >
            View all →
          </Link>
        </NavigationMenuLink>
      </div>
      <Separator className="bg-white/10" />
      {stores.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-white/60">
          No featured stores yet.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-1 p-2">
          {stores.slice(0, 8).map((store) => (
            <li key={store.id}>
              <NavigationMenuLink asChild>
                <Link
                  href={`/stores/${store.slug}`}
                  className="group/item flex flex-row items-center gap-3 rounded-md px-3 py-2.5 text-white/85 transition-colors hover:!bg-white/5 hover:!text-gold focus:!bg-white/5 focus:!text-gold"
                >
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
                    <Image
                      src={transformPath(store.image, 120)}
                      alt={`${store.storeName} logo`}
                      width={40}
                      height={40}
                      className="max-h-8 w-auto object-contain"
                    />
                  </div>
                  <span className="line-clamp-1 text-[13px] font-medium">
                    {store.storeName}
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoriesPanel({ categories }: { categories: FeaturedCategory[] }) {
  return (
    <div className="w-[340px]">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          Browse categories
        </span>
        <NavigationMenuLink asChild>
          <Link
            href="/categories"
            className="rounded-sm p-0 text-[11px] font-medium text-white/60 transition-colors hover:!bg-transparent hover:!text-gold"
          >
            View all →
          </Link>
        </NavigationMenuLink>
      </div>
      <Separator className="bg-white/10" />
      {categories.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-white/60">
          No categories yet.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-0.5 p-2">
          {categories.slice(0, 10).map((category) => (
            <li key={category.id}>
              <NavigationMenuLink asChild>
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center rounded-md px-3 py-2 text-[13px] font-medium text-white/80 transition-colors hover:!bg-white/5 hover:!text-gold focus:!bg-white/5 focus:!text-gold"
                >
                  {category.categoryName}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const mobileItemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05 + 0.08,
      duration: 0.32,
      ease: "easeOut" as const,
    },
  }),
};

export default function NavBar({
  countries = [],
  selectedCountry = null,
  featuredStores = [],
  featuredCategories = [],
}: {
  countries?: string[];
  selectedCountry?: string | null;
  featuredStores?: FeaturedStore[];
  featuredCategories?: FeaturedCategory[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full transition-[height,background-color,box-shadow,backdrop-filter] duration-300 ease-out",
        scrolled
          ? "h-[52px] bg-navy/92 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-lg lg:h-[64px]"
          : "h-[60px] bg-navy lg:h-[76px]"
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center gap-4 px-4 md:gap-6 md:px-6">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Link
            href="/"
            aria-label="CouponLuxury home"
            className="inline-flex items-center"
          >
            <Image
              src="/cl-logo.svg"
              alt="CouponLuxury"
              width={160}
              height={38}
              priority
              className={cn(
                "transition-[width] duration-300",
                scrolled ? "w-[132px] lg:w-[144px]" : "w-[144px] lg:w-[160px]"
              )}
            />
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <NavigationMenu
          viewport={false}
          className="hidden md:flex [&>div]:static"
        >
          <NavigationMenuList className="gap-0.5">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                active={pathname === "/"}
                className={cn(
                  navTriggerCls(pathname === "/"),
                  "inline-flex items-center"
                )}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={navTriggerCls(
                  pathname?.startsWith("/stores") ?? false
                )}
              >
                Stores
              </NavigationMenuTrigger>
              <NavigationMenuContent className="!border-white/10 !bg-navy/95 !p-0 !text-white !shadow-2xl !backdrop-blur-md">
                <StoresPanel stores={featuredStores} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={navTriggerCls(
                  pathname?.startsWith("/categories") ?? false
                )}
              >
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent className="!border-white/10 !bg-navy/95 !p-0 !text-white !shadow-2xl !backdrop-blur-md">
                <CategoriesPanel categories={featuredCategories} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                active={pathname === "/deals"}
                className={cn(
                  navTriggerCls(pathname === "/deals"),
                  "inline-flex items-center"
                )}
              >
                <Link href="/deals">Deals</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                active={pathname === "/blogs"}
                className={cn(
                  navTriggerCls(pathname === "/blogs"),
                  "inline-flex items-center"
                )}
              >
                <Link href="/blogs">Blogs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block">
            <SearchTrigger country={selectedCountry} variant="full" />
          </div>
          <div className="sm:hidden">
            <SearchTrigger country={selectedCountry} variant="icon" />
          </div>
          <Separator
            orientation="vertical"
            className="!h-5 bg-white/10"
            decorative
          />
          <CountrySelector countries={countries} selected={selectedCountry} />

          {/* Mobile trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden text-white hover:bg-white/10 hover:text-white"
              >
                <motion.span
                  key={mobileOpen ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <MenuIcon className="size-5" />
                </motion.span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="ham-background w-[84vw] max-w-[340px] border-l border-gold/20 p-0 text-white"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-gold via-teal to-gold/40" />

              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-6 pt-5 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/90">
                    Menu
                  </span>
                </div>

                <div className="flex flex-col px-6 py-6">
                  <AnimatePresence>
                    {mobileOpen &&
                      mobileLinks.map((link, i) => {
                        const active =
                          link.slug === "/"
                            ? pathname === "/"
                            : pathname?.startsWith(link.slug);
                        return (
                          <motion.div
                            key={link.name}
                            custom={i}
                            variants={mobileItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="w-full"
                          >
                            <Link
                              href={link.slug}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "group flex items-baseline justify-between border-b border-white/10 py-4 transition-colors",
                                active
                                  ? "text-gold"
                                  : "text-white hover:text-gold"
                              )}
                            >
                              <span className="text-[22px] font-semibold tracking-[0.01em]">
                                {link.name}
                              </span>
                              <span className="text-xs text-white/40 transition-transform duration-300 group-hover:translate-x-1">
                                →
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                    Shop from
                  </span>
                  <CountrySelector
                    countries={countries}
                    selected={selectedCountry}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Gold hairline — appears on scroll */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-px transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(196,154,60,0.55) 30%, rgba(0,146,192,0.4) 70%, transparent)",
        }}
      />
    </header>
  );
}

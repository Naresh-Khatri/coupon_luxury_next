"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBox from "./SearchBox";
import { cn } from "@/lib/utils";

type Store = { id: string | number; slug: string; storeName: string; image: string };
type Category = { id: string | number; slug: string; categoryName: string };

const primaryLinks = [
  { name: "Home", slug: "/" },
  { name: "Blogs", slug: "/blogs" },
];

const mobileLinks = [
  { name: "Home", slug: "/" },
  { name: "Stores", slug: "/stores" },
  { name: "Categories", slug: "/categories" },
  { name: "Blogs", slug: "/blogs" },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07 + 0.1, duration: 0.35, ease: "easeOut" },
  }),
};

function NavLink({
  children,
  slug,
  active,
}: {
  children: React.ReactNode;
  slug: string;
  active: boolean;
}) {
  return (
    <Link
      href={slug}
      className={cn(
        "relative rounded-md px-3 py-2 text-[15px] font-medium tracking-[0.3px] text-white/90 transition-all duration-200 hover:text-white",
        active
          ? "bg-[rgba(0,146,192,0.25)] border-b-2 border-gold"
          : "border-b-2 border-transparent"
      )}
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    Promise.allSettled([
      axios.get("https://apiv2.couponluxury.com/stores?featered=true&limit=10"),
      axios.get("https://apiv2.couponluxury.com/categories?featered=true&limit=10"),
    ]).then((res) => {
      if (res[0].status === "fulfilled") setFeaturedStores(res[0].value.data || []);
      if (res[1].status === "fulfilled") setFeaturedCategories(res[1].value.data || []);
    });
  }, []);

  return (
    <>
      <motion.header
        className="sticky top-0 z-[99] flex h-[59px] w-full justify-center overflow-hidden font-bold md:h-[75px]"
        style={{ backdropFilter: "blur(12px)" }}
        animate={{
          backgroundColor: scrolled ? "rgba(13, 27, 42, 0.97)" : "rgba(13, 27, 42, 1)",
          boxShadow: scrolled
            ? "0 2px 24px rgba(0,0,0,0.35)"
            : "0 1px 0 rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full w-full max-w-[1200px] px-4 text-white">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-8">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <Link href="https://www.couponluxury.com/" title="Home">
                  <Image
                    src="/cl-logo.svg"
                    alt="CouponLuxury logo"
                    width={180}
                    height={42}
                    priority
                  />
                </Link>
              </motion.div>

              <nav className="hidden items-center gap-1 md:flex">
                <NavLink slug="/" active={pathname === "/"}>
                  Home
                </NavLink>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium tracking-[0.3px] text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white outline-none",
                      pathname?.includes("/stores")
                        ? "bg-[rgba(0,146,192,0.25)] border-b-2 border-gold"
                        : "border-b-2 border-transparent"
                    )}
                  >
                    Stores <ChevronDown className="size-4 text-white/70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[500px] overflow-auto">
                    <DropdownMenuItem asChild className="font-bold">
                      <Link href="/stores" className="w-full justify-center">
                        All Stores
                      </Link>
                    </DropdownMenuItem>
                    {featuredStores.map((store) => (
                      <DropdownMenuItem key={store.id} asChild>
                        <Link href={`/stores/${store.slug}`} className="py-1.5">
                          <Image
                            src={store.image}
                            alt={`${store.storeName} - Logo`}
                            width={80}
                            height={40}
                          />
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium tracking-[0.3px] text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white outline-none",
                      pathname?.includes("/categories")
                        ? "bg-[rgba(0,146,192,0.25)] border-b-2 border-gold"
                        : "border-b-2 border-transparent"
                    )}
                  >
                    Categories <ChevronDown className="size-4 text-white/70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[500px] overflow-auto">
                    <DropdownMenuItem asChild className="font-bold">
                      <Link href="/categories" className="w-full justify-center">
                        All Categories
                      </Link>
                    </DropdownMenuItem>
                    {featuredCategories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="w-40 font-medium"
                        >
                          {category.categoryName}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {primaryLinks.slice(1).map((l) => (
                  <NavLink key={l.slug} slug={l.slug} active={pathname === l.slug}>
                    {l.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <SearchBox />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
              className="z-[101] inline-flex size-10 items-center justify-center rounded-md text-white hover:bg-white/10 md:hidden"
            >
              {isOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="ham-background fixed top-0 right-0 z-[100] h-screen w-[75vw] max-w-[320px] md:hidden"
              style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.4)" }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                aria-label="Close Menu"
                className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </motion.button>

              <div
                className="absolute top-0 left-0 h-full w-[3px]"
                style={{
                  background: "linear-gradient(to bottom, #C49A3C, #0092c0)",
                }}
              />

              <nav className="flex flex-col items-start gap-2 pt-[100px] pl-10 pr-6">
                {mobileLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    custom={i}
                    variants={mobileLinkVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    <Link href={link.slug}>
                      <div className="py-3 border-b border-white/10 transition-colors duration-200 hover:text-gold">
                        <span
                          className={cn(
                            "text-2xl font-semibold tracking-[0.5px] font-[var(--font-display)]",
                            pathname === link.slug ? "text-gold" : "text-white"
                          )}
                        >
                          {link.name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[98] bg-black/60 md:hidden"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

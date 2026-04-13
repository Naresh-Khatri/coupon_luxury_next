"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import SideBar from "@/components/BlogPanel/SideBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import account from "@/appwrite/config";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        await account.get();
      } catch {
        toast.error("You are not logged in", {
          description: "Redirected to the login page...",
        });
        router.push("/blogs/login");
      }
    })();
  }, [router]);

  const route = pathname?.split("/").pop() || "";

  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <div className="relative flex w-full flex-col bg-gray-100">
        <header className="absolute left-0 right-0 z-10 m-7 flex min-h-[90px] items-center justify-between rounded-[20px] bg-white/50 p-4 shadow-md backdrop-blur-md">
          <div className="flex flex-col">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/blogs/admin" className="hover:underline">
                blogs
              </a>
              <span>/</span>
              <a href="/blogs/admin/create" className="hover:underline">
                create
              </a>
            </nav>
            <p className="text-2xl font-bold">{route}</p>
          </div>
          <AccountMenu />
        </header>
        <div className="overflow-auto pt-[120px]">{children}</div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const [userInfo, setUserInfo] = useState<{ name?: string } | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    account
      .get()
      .then((res) => setUserInfo(res))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
    } catch {}
    setUserInfo({});
    setLogoutOpen(false);
    router.push("/blogs");
  };

  const initial = (userInfo?.name || "U").charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-12 items-center justify-center rounded-full bg-brand-900 text-lg font-semibold text-white outline-none">
          {initial}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col items-center gap-2 py-4">
            <Image
              src="https://ik.imagekit.io/couponluxury/og_image_1I5dOd_ix?updatedAt=1655124742982"
              alt="avatar"
              width={96}
              height={96}
              className="rounded-full"
            />
            <p>hey, {userInfo?.name || "user"} 👋</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Your Profile</DropdownMenuItem>
          <DropdownMenuItem disabled>Account Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to logout?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

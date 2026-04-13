"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import account from "@/appwrite/config";

export default function BlogsLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    account
      .get()
      .then((res) => {
        if (res.$id) {
          toast.success("You are already logged in", {
            description: "Welcome to the admin page",
          });
          router.push("/blogs/admin");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await account.createEmailSession(
        `${username}@example.com`,
        password
      );
      toast.success("You are logged in", {
        description: "Redirected to the admin page",
      });
      router.push("/blogs/admin");
    } catch (err) {
      toast.error("An error occurred.", {
        description: "Check your credentials or try again.",
      });
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="mx-auto max-w-lg py-12 px-6 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Sign in to your account</h1>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-lg space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-400 hover:bg-blue-500">
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}

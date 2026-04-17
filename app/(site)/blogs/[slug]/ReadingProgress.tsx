"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress((scrollY / documentHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed left-0 z-[999] h-[3px] rounded-r-sm transition-all duration-150 ease-linear"
      style={{
        top: "var(--nav-offset, 59px)",
        width: `${progress}%`,
        background: "linear-gradient(to right, #0092c0, #C49A3C)",
      }}
    />
  );
}

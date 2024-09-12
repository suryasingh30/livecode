"use client";

import Link from "next/link";
import Image from "next/image";
import { sidebarLink } from "@/app/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => setIsExpanded(false), []);

  return (
    <section
      className={cn(
        "sticky left-0 top-0 flex h-screen transition-all duration-200 ease-in-out flex-col justify-between bg-dark-1 p-6 pt-20 text-white max-sm:hidden",
        isExpanded ? "w-[264px]" : "w-[105px]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-6">
        {sidebarLink.map((link) => {
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                "flex gap-4 items-center p-4 rounded-lg transition-all duration-300 ease-in-out",
                isActive ? "bg-blue-1 text-white" : "text-white"
              )}
            >
              <Image
                src={link.imgUrl}
                alt={link.label}
                width={24}
                height={24}
              />
              <span className={isExpanded ? "whitespace-nowrap" : "sr-only"}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

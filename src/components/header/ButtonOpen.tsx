"use client";
import { useSidebarStore } from "@/store/useSideBarStore";
import { Menu } from "lucide-react";
import React from "react";

export default function ButtonOpen() {
  const { toggleSidebar, isOpen } = useSidebarStore();
  console.log(isOpen);
  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 rounded-xl hover:bg-white/20 transition-colors"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}

// components/Layout.tsx
"use client";
import { useEffect } from "react";
import Header from "@/components/header/Header";
import Sidebar from "@/components/header/Sidebar";
import { useSidebarStore } from "@/store/useSideBarStore";

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
}

export default function LayoutSideBar({ children, user }: LayoutProps) {
  const { closeSidebar } = useSidebarStore();
  const isAuthenticated =
    user?.message !== "No se encontró token de autenticación";

  // Cerrar sidebar en resize a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSidebar]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header siempre visible */}
      <Header user={user} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - solo si está autenticado */}
        {isAuthenticated && <Sidebar />}

        {/* Contenido principal */}
        <main
          className={`
            flex-1 overflow-auto
            ${isAuthenticated ? "lg:ml-0" : ""}
          `}
        >
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

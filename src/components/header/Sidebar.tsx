// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarStore } from "@/store/useSideBarStore";
import {
  Home,
  Package,
  Settings,
  FileText,
  BarChart3,
  X,
  ChevronLeft,
  Users,
  Router,
} from "lucide-react";

const navigation = [{ name: "Dashboard", href: "/", icon: Home }];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, closeSidebar } = useSidebarStore();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200 shadow-lg lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Panel</h2>
              <p className="text-xs text-gray-500 -mt-1">Control</p>
            </div>
          </div>

          {/* Botón cerrar en móvil */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  // Cerrar sidebar en móvil al navegar
                  if (window.innerWidth < 1024) {
                    closeSidebar();
                  }
                }}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-l-4 border-purple-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive
                      ? "text-purple-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Consulta nuestra documentación
            </p>
            <button
              onClick={() => {
                router.push("https://docs.marcaenlinea.com");
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Ver Guías
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

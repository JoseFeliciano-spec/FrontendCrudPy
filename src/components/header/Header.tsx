// components/Header.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { UserCircle, ChevronDown } from "lucide-react";
import ButtonLogout from "@/components/auth/ButtonLogout";
import ButtonOpen from "./ButtonOpen";

export default function Header({ user }: any) {
  const isAuthenticated =
    user?.message !== "No se encontró token de autenticación";

  return (
    <header className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>

      <div className="relative flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          {/* Botón hamburguesa para móvil - solo si está autenticado */}
          {isAuthenticated && <ButtonOpen />}

          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Registro Marcas</h1>
              <p className="text-xs text-white/80 -mt-1">Gestión Inteligente</p>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        {!isAuthenticated ? (
          <Button
            asChild
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 transition-all hover:scale-105"
          >
            <Link href="/login">✨ Iniciar Sesión</Link>
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-white/20 rounded-xl px-4 py-2 transition-all hover:scale-105"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-sm">
                    {user?.data?.name}
                  </div>
                  <div className="text-xs text-white/80">
                    {user?.data?.email}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mr-4 border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl">
              <div className="flex flex-col space-y-1">
                {/* User Info Card */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl mb-2">
                  <div className="font-semibold text-slate-800">
                    {user?.data?.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {user?.data?.email}
                  </div>
                </div>
                <Separator className="my-2" />

                {/* Logout Button */}
                <div className="p-1">
                  <ButtonLogout />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}

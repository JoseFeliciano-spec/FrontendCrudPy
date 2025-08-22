import dynamic from "next/dynamic";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicFormAuth = dynamic(() => import("@/components/auth/FormAuth"), {
  loading: () => (
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-12 w-full bg-gradient-to-r from-purple-200 to-blue-200" />
      <Skeleton className="h-12 w-full bg-gradient-to-r from-blue-200 to-cyan-200" />
      <Skeleton className="h-10 w-full bg-gradient-to-r from-purple-200 to-pink-200" />
    </div>
  ),
});

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-cyan-200 rounded-full opacity-20 animate-ping delay-500"></div>

      <div className="h-full w-full flex flex-col justify-center items-center px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Header con ícono */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-xl">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              ¡Bienvenido de vuelta!
            </h1>
            <h2 className="text-slate-600 text-base">
              Accede a tu plataforma de{" "}
              <span className="font-semibold text-purple-600">
                Registro de Marcas
              </span>
            </h2>
          </div>

          {/* Contenedor del formulario */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <DynamicFormAuth type="login" />
          </div>

          {/* Separador estilizado */}
          <div className="flex justify-center items-center my-8">
            <div className="flex items-center w-full max-w-sm gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <span className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded-full">
                o
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-300 to-transparent"></div>
            </div>
          </div>

          {/* Link de registro */}
          <div className="text-center">
            <p className="text-slate-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all hover:underline"
              >
                Regístrate aquí ✨
              </Link>
            </p>
            <div className="mt-2 text-xs text-slate-400">
              Comienza a gestionar tus marcas en segundos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import dynamic from "next/dynamic";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicFormAuth = dynamic(() => import("@/components/auth/FormAuth"), {
  loading: () => (
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-12 w-full bg-gradient-to-r from-green-200 to-emerald-200" />
      <Skeleton className="h-12 w-full bg-gradient-to-r from-blue-200 to-cyan-200" />
      <Skeleton className="h-12 w-full bg-gradient-to-r from-purple-200 to-pink-200" />
      <Skeleton className="h-10 w-full bg-gradient-to-r from-amber-200 to-orange-200" />
    </div>
  ),
});

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-16 left-8 w-28 h-28 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-300"></div>
      <div className="absolute bottom-28 right-12 w-36 h-36 bg-purple-200 rounded-full opacity-20 animate-bounce delay-700"></div>
      <div className="absolute top-2/4 right-8 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-ping delay-1000"></div>

      <div className="h-full w-full flex flex-col justify-center items-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Header con ícono */}
          <div className="text-center mb-8 max-md:mt-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center shadow-xl">
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3">
              ¡Únete a nosotros!
            </h1>
            <h2 className="text-slate-600 text-base">
              Comienza tu experiencia en{" "}
              <span className="font-semibold text-emerald-600">
                Registro de Marcas
              </span>
            </h2>
          </div>

          {/* Contenedor del formulario */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <DynamicFormAuth type="register" />
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

          {/* Link de login */}
          <div className="text-center">
            <p className="text-slate-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-blue-700 transition-all hover:underline"
              >
                Inicia sesión aquí 🔑
              </Link>
            </p>
            <div className="mt-2 text-xs text-slate-400">
              Accede a tu cuenta en segundos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

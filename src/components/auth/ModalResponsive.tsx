"use client";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import ModalSSR from "@/components/home/ModalSSR";
import DialogSSR from "@/components/home/DialogSSR";

const DynamicFormAuth = dynamic(
  () => {
    return import("@/components/auth/FormAuth");
  },
  {
    loading: () => (
      <div className="w-full h-min">
        <Skeleton className="w-full h-12 mt-3 bg-gradient-to-r from-purple-200 to-blue-200" />
        <Skeleton className="w-full h-12 my-5 bg-gradient-to-r from-blue-200 to-cyan-200" />
        <Skeleton className="w-full h-12 my-2 bg-gradient-to-r from-purple-200 to-pink-200" />
      </div>
    ),
  }
);

export default function ModalResponsive() {
  const matches = useMediaQuery("(min-width: 1024px)");

  const ModalContent = () => (
    <div className="flex flex-col justify-center items-center relative">
      {/* Elementos decorativos */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30 animate-bounce"></div>

      {/* Header con ícono */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📋</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ¡Bienvenido de vuelta!
        </h1>
        <h2 className="text-slate-600 text-sm">
          Accede a tu plataforma de{" "}
          <span className="font-semibold text-purple-600">
            Registro de Marcas
          </span>
        </h2>
      </div>

      <DynamicFormAuth type="login" id="modal" />

      {/* Separador estilizado */}
      <div className="container lg:w-[28rem] flex justify-center items-center my-6">
        <div className="flex items-center w-full gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200"></div>
          <span className="text-xs text-slate-400 font-medium">o</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200"></div>
        </div>
      </div>

      {/* Link de registro */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            onClick={() => {
              window.location.href = "/register";
            }}
            className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Regístrate aquí ✨
          </Link>
        </p>
        <div className="mt-2 text-xs text-slate-400">
          Comienza a gestionar tus marcas en segundos
        </div>
      </div>
    </div>
  );

  return matches ? (
    <ModalSSR>
      <ModalContent />
    </ModalSSR>
  ) : (
    <DialogSSR>
      <ModalContent />
    </DialogSSR>
  );
}

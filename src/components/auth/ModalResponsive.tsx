"use client";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import ModalSSR from "@/components/home/ModalSSR";
import DialogSSR from "@/components/home/DialogSSR";
import { Separator } from "@/components/ui/separator";

const DynamicFormAuth = dynamic(
  () => {
    return import("@/components/auth/FormAuth");
  },
  {
    loading: () => (
      <div className="w-full h-min">
        <Skeleton className="w-full h-12 mt-3 bg-gray-200 dark:bg-gray-400" />
        <Skeleton className="w-full h-12 my-5 bg-gray-200 dark:bg-gray-400" />
        <Skeleton className="w-full h-12 my-2 bg-gray-200 dark:bg-gray-400" />
      </div>
    ),
  }
);

export default function ModalResponsive() {
  const matches = useMediaQuery("(min-width: 1024px)");

  return matches ? (
    <ModalSSR>
      <div className="flex flex-col justify-center items-center">
        <div>
          <h1 className="text-lg font-semibold text-center">
            Bienvenido de vuelta a FeliInventory
          </h1>
          <h2 className="text-base text-center">
            Ingresa tu usuario y contraseña para continuar
          </h2>
        </div>

        <DynamicFormAuth type="login" id="modal" />

        <div className="container lg:w-[28rem] flex justify-center items-center my-5">
          <div className="w-full">
            <Separator />
          </div>
        </div>
        <h3 className="text-sm mt-6">
          <Link
            href={"/register"}
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            ¿No tienes cuenta? <span className="font-semibold">Regístrate</span>
          </Link>
        </h3>
      </div>
    </ModalSSR>
  ) : (
    <DialogSSR>
      <div className="flex flex-col justify-center items-center">
        <div>
          <h1 className="text-lg font-semibold text-center">
            Bienvenido de vuelta a FeliInventory
          </h1>
          <h2 className="text-base text-center">
            Ingresa tu usuario y contraseña para continuar
          </h2>
        </div>

        <DynamicFormAuth type="login" id="modal" />

        <div className="container lg:w-[28rem] flex justify-center items-center my-5">
          <div className="w-full">
            <Separator />
          </div>
        </div>

        <h3 className="text-sm mt-6">
          <Link
            href={"/register"}
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            ¿No tienes cuenta? <span className="font-semibold">Regístrate</span>
          </Link>
        </h3>
      </div>
    </DialogSSR>
  );
}

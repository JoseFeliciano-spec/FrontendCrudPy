import dynamic from "next/dynamic";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const DynamicFormAuth = dynamic(() => import("@/components/auth/FormAuth"), {
  loading: () => <p>Loading...</p>,
});

export default function LoginPage() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="max-md:mt-4">
        <h1 className="text-lg font-semibold text-center">
          Bienvenido de vuelta a FeliInventorys
        </h1>
        <h2 className="text-base text-center">
          Ingresa la información para registrarte
        </h2>
      </div>

      <DynamicFormAuth type="register" />

      <div className="container lg:w-[28rem] flex justify-center items-center my-5">
        <div className="w-full">
          <Separator />
        </div>
      </div>

      <Link href="/login">
        <h3 className="text-sm mt-6">
          ¿Tienes cuenta? <span className="font-semibold">Inicia sesión</span>
        </h3>
      </Link>
    </div>
  );
}

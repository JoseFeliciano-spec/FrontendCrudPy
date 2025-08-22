"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { userStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth/register";
import { login } from "@/actions/auth/login";
import revalidatePathLocal from "@/actions/revalidath";

// Define tipos para los datos del formulario
type FormData = {
  name?: string;
  email: string;
  password: string;
  passwordRepeat?: string;
};

// Schema para el registro
const registerSchema = yup.object().shape({
  name: yup.string().required("El nombre completo es requerido"),
  email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  passwordRepeat: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Confirmar la contraseña es requerido"),
});

// Schema para el inicio de sesión
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es requerida"),
});

// Función para seleccionar el schema adecuado
const getSchema = (type: "login" | "register") => {
  return type === "login" ? loginSchema : registerSchema;
};

type FormAuthProps = {
  type: "login" | "register";
  id?: string;
};

export default function FormAuth({ type, id }: FormAuthProps) {
  const router = useRouter();
  const { user } = userStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(getSchema(type)),
  });

  const onSubmitLogin = async (data: FormData) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (response?.statusCode === 200) {
        userStore.setState({
          user: { currentUser: response?.data },
        });
        toast.success("Inicio de sesión exitoso");
        if (id === "modal") {
          router.back();
          return;
        }
        router.push("/");
        return;
      }
      toast.error("Ha ocurrido un error");
    } catch (error) {
      console.error(error);
      toast.error("Error en el inicio de sesión");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response?.statusCode !== 200) {
        toast.error("Existe un problema con el registro");
        return;
      }
      userStore.setState({
        user: { currentUser: response?.data },
      });
      toast.success("Registro exitoso");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(
        "Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo."
      );
    }
  };

  const onHandleSubmit = async (e: FormData) => {
    if (type === "login") {
      await onSubmitLogin(e);
    } else {
      await onSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (user?.currentUser) {
        revalidatePathLocal();
      }
    };
  }, [user?.currentUser]);

  return (
    <div className="w-full space-y-5 pt-4">
      {/* Nombre completo (solo registro) */}
      {type === "register" && (
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-semibold text-slate-700"
          >
            Nombre completo
          </Label>
          <Input
            type="text"
            {...register("name")}
            id="name"
            placeholder="Introduce tu nombre completo"
            className="border-2 border-slate-200 focus:border-purple-400 focus:ring-purple-400 transition-colors bg-slate-50 focus:bg-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.name.message}
            </p>
          )}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Correo electrónico
        </Label>
        <Input
          type="email"
          {...register("email")}
          id="email"
          placeholder="Introduce tu correo electrónico"
          className="border-2 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-colors bg-slate-50 focus:bg-white"
        />
        {errors.email && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700"
        >
          Contraseña
        </Label>
        <PasswordInput
          {...register("password")}
          id="password"
          placeholder="Introduce tu contraseña"
          className="border-2 border-slate-200 focus:border-cyan-400 focus:ring-cyan-400 transition-colors bg-slate-50 focus:bg-white"
        />
        {errors.password && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Repetir contraseña (solo registro) */}
      {type === "register" && (
        <div className="space-y-2">
          <Label
            htmlFor="passwordRepeat"
            className="text-sm font-semibold text-slate-700"
          >
            Repetir contraseña
          </Label>
          <PasswordInput
            {...register("passwordRepeat")}
            id="passwordRepeat"
            placeholder="Introduce tu contraseña nuevamente"
            className="border-2 border-slate-200 focus:border-pink-400 focus:ring-pink-400 transition-colors bg-slate-50 focus:bg-white"
          />
          {errors.passwordRepeat && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.passwordRepeat.message}
            </p>
          )}
        </div>
      )}

      {/* Link de recuperar contraseña */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Botón de submit */}
      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70"
        onClick={handleSubmit(onHandleSubmit)}
        disabled={isSubmitting}
      >
        {!isSubmitting ? (
          <span className="flex items-center gap-2">
            <span>{type === "login" ? "Iniciar sesión" : "Crear cuenta"}</span>
            <span className="text-lg">{type === "login" ? "🔑" : "🚀"}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
            <span>Procesando...</span>
          </span>
        )}
      </Button>
    </div>
  );
}

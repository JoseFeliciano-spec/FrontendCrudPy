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
/* import { useToast } from "@/hooks/use-toast"; */
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
  /*  const { toast } = useToast();
  const router = useRouter();
   */
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
        toast.success(response?.message);
        if (id === "modal") {
          router.back();
          return;
        }

        router.push("/");
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

      if (response?.statusCode !== 202) {
        toast.error(response?.errors as any);
        return;
      }

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
    <>
      <div className="mt-2" />
      {type === "register" && (
        <div className="container lg:w-[28rem] mt-4">
          <div className="grid w-full md:w-sm items-center gap-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              type="text"
              {...register("name")}
              id="name"
              placeholder="Introduce tu nombre completo"
              className="border-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
        </div>
      )}
      <div className="container lg:w-[28rem] my-3 md:my-4">
        <div className="grid w-full md:w-sm items-center gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            type="email"
            {...register("email")}
            id="email"
            placeholder="Introduce tu correo electrónico"
            className="border-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="container lg:w-[28rem]">
        <div className="grid w-full md:w-sm items-center gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <PasswordInput
            {...register("password")}
            id="password"
            placeholder="Introduce tu contraseña"
            className="border-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
      </div>
      {type === "register" && (
        <div className="container lg:w-[28rem] mt-3 md:mt-4">
          <div className="grid w-full md:w-sm items-center gap-2">
            <Label htmlFor="passwordRepeat">Repetir contraseña</Label>
            <PasswordInput
              {...register("passwordRepeat")}
              id="passwordRepeat"
              placeholder="Introduce tu contraseña nuevamente"
              className="border-2"
            />
            {errors.passwordRepeat && (
              <p className="text-red-500 text-sm">
                {errors.passwordRepeat.message}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="container lg:w-[28rem]">
        <p className="my-4 text-sm font-semibold text-left">
          Recuperar contraseña
        </p>
      </div>

      <div className="container lg:w-[28rem] mb-3">
        <Button className="w-full" onClick={handleSubmit(onHandleSubmit)}>
          {!isSubmitting ? (
            <>{type === "login" ? "Iniciar sesión" : "Registrar"}</>
          ) : (
            <>
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          )}
        </Button>
      </div>
    </>
  );
}

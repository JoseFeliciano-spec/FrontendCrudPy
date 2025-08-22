// components/ProductStepsForm.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react"; // Ensure React is in scope for JSX

// --- Helper Components ---

// Icon components using inline SVG to avoid external dependencies
const TagIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const FileTextIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const SettingsIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CheckIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// --- Main Component ---

interface ProductFormData {
  marca: string;
  titulo: string;
  estado: "activo" | "inactivo" | "borrador";
}

const productSchema = yup.object({
  marca: yup.string().required("La marca es obligatoria").min(1).max(100),
  titulo: yup.string().required("El título es obligatorio").min(1).max(200),
  estado: yup
    .string()
    .oneOf(["activo", "inactivo", "borrador"])
    .required("El estado es obligatorio"),
});

interface ProductStepsFormProps {
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
  initialData?: ProductFormData;
  isEdit?: boolean;
}

export default function ProductStepsForm({
  onSubmit,
  isLoading,
  onCancel,
  initialData,
  isEdit = false,
}: ProductStepsFormProps) {
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || { marca: "", titulo: "", estado: "activo" },
    mode: "onChange",
  });

  const steps = [
    { title: "Marca", description: "Define la marca", icon: TagIcon },
    { title: "Título", description: "Establece el título", icon: FileTextIcon },
    { title: "Estado", description: "Configura el estado", icon: SettingsIcon },
    {
      title: "Completado",
      description: "Producto registrado",
      icon: CheckIcon,
    },
  ];

  const watchedFields = form.watch();
  const canAdvance = (step: number) => {
    switch (step) {
      case 0:
        return !!watchedFields.marca && !form.formState.errors.marca;
      case 1:
        return !!watchedFields.titulo && !form.formState.errors.titulo;
      case 2:
        return !!watchedFields.estado && !form.formState.errors.estado;
      default:
        return false;
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    if (!isEdit) setActiveStep(3);
  });

  const progressValue = ((activeStep + 1) / steps.length) * 100;

  const stateColorClasses = {
    activo: "bg-green-100 text-green-800",
    inactivo: "bg-red-100 text-red-800",
    borrador: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
      <div className="p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Editar Producto" : "Crear Nuevo Producto"}
            </h1>
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
              Paso {activeStep + 1} de {steps.length}
            </span>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>

          {/* Steps Header */}
          <div className="flex space-x-4 w-full justify-center flex-wrap">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center space-y-2 transition-opacity ${
                  index <= activeStep ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`p-3 rounded-full ${
                    index <= activeStep
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-center space-y-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <hr className="w-full border-t border-gray-200" />

          {/* Step Content */}
          <div className="w-full min-h-[300px]">
            {activeStep === 0 && (
              <div className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="marca"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Marca *
                  </label>
                  <input
                    id="marca"
                    type="text"
                    placeholder="Ej: Nike, Apple, Toyota..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      form.formState.errors.marca
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...form.register("marca")}
                  />
                  {form.formState.errors.marca && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.marca.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="titulo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Título *
                  </label>
                  <input
                    id="titulo"
                    type="text"
                    placeholder="Ej: Zapatillas deportivas modelo X1..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      form.formState.errors.titulo
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...form.register("titulo")}
                  />
                  {form.formState.errors.titulo && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.titulo.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="flex flex-col space-y-6">
                <div>
                  <label
                    htmlFor="estado"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Estado *
                  </label>
                  <select
                    id="estado"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      form.formState.errors.estado
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...form.register("estado")}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="borrador">Borrador</option>
                  </select>
                  {form.formState.errors.estado && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.estado.message}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Resumen del Producto
                  </h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <p className="font-bold text-gray-700 w-16">Marca:</p>
                      <p className="text-gray-600">
                        {watchedFields.marca || "Sin definir"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold text-gray-700 w-16">Título:</p>
                      <p className="text-gray-600">
                        {watchedFields.titulo || "Sin definir"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold text-gray-700 w-16">Estado:</p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          stateColorClasses[watchedFields.estado] ||
                          stateColorClasses.activo
                        }`}
                      >
                        {watchedFields.estado || "activo"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? isEdit
                      ? "Actualizando..."
                      : "Creando producto..."
                    : isEdit
                    ? "Actualizar Producto"
                    : "Crear Producto"}
                </button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="flex flex-col items-center space-y-6 py-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckIcon className="w-10 h-10 text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-green-600">
                    ¡Producto Creado Exitosamente!
                  </h2>
                  <p className="text-gray-600">
                    El producto ha sido registrado en el sistema.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      form.reset();
                      setActiveStep(0);
                    }}
                    className="bg-white text-gray-700 font-semibold py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Crear Otro
                  </button>
                  <button
                    onClick={onCancel}
                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700"
                  >
                    Ver Tabla
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          {activeStep < 3 && (
            <>
              <hr className="w-full border-t border-gray-200" />
              <div className="flex justify-between w-full">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="font-semibold text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onCancel}
                    className="font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  {activeStep < 2 && (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      disabled={!canAdvance(activeStep)}
                      className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente →
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

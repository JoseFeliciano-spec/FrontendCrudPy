"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axios } from "@/lib/axios";
import {
  Button,
  Heading,
  Input,
  Text,
  Steps,
  Field,
  Card,
  Icon,
  Badge,
  Container,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { CheckIcon, UserIcon, CarIcon, IdCardIcon } from "lucide-react";

// Esquemas de validación con Yup actualizados
const userSchema = yup.object({
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("Debe ser un email válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: yup.string().required("El nombre es obligatorio"),
});

const driverSchema = yup.object({
  license: yup
    .string()
    .required("La licencia es obligatoria")
    .matches(
      /^[A-Z0-9-]+$/,
      "La licencia debe ser alfanumérica con guiones (ej: ABC-123)"
    ),
  assignedVehicle: yup.string().optional(),
});

const vehicleSchema = yup.object({
  modelCar: yup.string().required("El modelCar es obligatorio"),
  plate: yup
    .string()
    .required("La placa es obligatoria")
    .matches(
      /^[A-Z0-9-]+$/,
      "La placa debe ser alfanumérica con guiones (ej: ABC-123)"
    ),
  fuelLevel: yup
    .number()
    .required("El nivel de combustible es obligatorio")
    .min(0, "Debe ser al menos 0")
    .max(100, "Debe ser como máximo 100"),
  latitude: yup.number().optional(),
  longitude: yup.number().optional(),
  timestamp: yup.string().optional(),
});

// Tipos inferidos de Yup
type UserFormData = yup.InferType<typeof userSchema>;
type DriverFormData = yup.InferType<typeof driverSchema>;
type VehicleFormData = yup.InferType<typeof vehicleSchema>;

// Función para llamar a la API usando Axios
const apiPost = async (url: string, body: any, token: string | null) => {
  if (!token) {
    throw new Error("Token de autenticación no encontrado");
  }
  console.log(token);
  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en la solicitud");
  }
};

export default function CreateDriverVehiclePage({ user }: any) {
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const steps = [
    {
      title: "Crear Usuario",
      description: "Registra el usuario conductor",
      icon: IdCardIcon,
    },
    {
      title: "Crear Driver",
      description: "Asigna datos de conductor",
      icon: UserIcon,
    },
    {
      title: "Crear Vehicle",
      description: "Registra el vehículo",
      icon: CarIcon,
    },
    {
      title: "Confirmación",
      description: "Proceso completado",
      icon: CheckIcon,
    },
  ];

  // Efecto para manejar la hidratación y obtener el token
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mutación para crear usuario
  const createUserMutation = useMutation({
    mutationFn: (data: UserFormData) =>
      apiPost("/v1/user/register-driver", data, user?.data?.token),
    onSuccess: (data) => {
      setUserId(data.data?.id || data.id || null);
      toast.success("Usuario creado exitosamente", {
        duration: 3000,
        style: {
          background: "#48BB78",
          color: "white",
        },
      });
      setActiveStep(1);
    },
    onError: (error: any) => {
      toast.error(error.message, {
        duration: 3000,
        style: {
          background: "#F56565",
          color: "white",
        },
      });
    },
  });

  // Mutación para crear driver
  const createDriverMutation = useMutation({
    mutationFn: (data: DriverFormData) =>
      apiPost(
        "/v1/drivers",
        {
          idUser: userId,
          license: data.license,
          assignedVehicle: data.assignedVehicle || undefined,
        },
        user?.data?.token
      ),
    onSuccess: (data) => {
      setDriverId(data?.idUser || null);
      toast.success("Driver creado exitosamente", {
        duration: 3000,
        style: {
          background: "#48BB78",
          color: "white",
        },
      });
      setActiveStep(2);
    },
    onError: (error: any) => {
      toast.error(error.message, {
        duration: 3000,
        style: {
          background: "#F56565",
          color: "white",
        },
      });
    },
  });

  // Mutación para crear vehicle
  const createVehicleMutation = useMutation({
    mutationFn: (data: VehicleFormData) =>
      apiPost(
        "/v1/vehicles",
        {
          ...data,
          assignedDriver: driverId,
          timestamp: data.timestamp || new Date().toISOString(),
        },
        user?.data?.token
      ),
    onSuccess: () => {
      toast.success("Vehicle creado exitosamente", {
        duration: 3000,
        style: {
          background: "#48BB78",
          color: "white",
        },
      });
      setActiveStep(3);
      queryClient.invalidateQueries({ queryKey: ["drivers", "vehicles"] });
    },
    onError: (error: any) => {
      toast.error(error.message, {
        duration: 3000,
        style: {
          background: "#F56565",
          color: "white",
        },
      });
    },
  });

  // Forms con react-hook-form y Yup
  const userForm = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onChange",
  });

  const driverForm = useForm<DriverFormData>({
    resolver: yupResolver(driverSchema),
    defaultValues: { license: "", assignedVehicle: "" },
    mode: "onChange",
  });

  const vehicleForm = useForm<VehicleFormData>({
    resolver: yupResolver(vehicleSchema),
    defaultValues: { modelCar: "", plate: "", fuelLevel: 0 },
    mode: "onChange",
  });

  const handleReset = () => {
    setActiveStep(0);
    setUserId(null);
    setDriverId(null);
    userForm.reset();
    driverForm.reset();
    vehicleForm.reset();
  };

  // Prevenir hidratación hasta que el cliente esté listo
  if (!isClient) {
    return (
      <Container maxW="container.md" className="py-8">
        <div className="space-y-8">
          <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <Text color="gray.500">Cargando...</Text>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" className="py-8">
      {/* Header */}
      <div className="space-y-8 mb-8">
        <div className="text-center">
          <Heading
            size="xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            className="mb-2"
          >
            Crear Usuario, Driver y Vehicle
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Proceso completo para registrar conductores y vehículos
          </Text>
        </div>

        {/* Progress Badge */}
        <div className="flex justify-center">
          <Badge
            colorScheme={activeStep === 3 ? "green" : "blue"}
            className="px-4 py-2 rounded-full text-sm"
          >
            Paso {activeStep + 1} de {steps.length}
          </Badge>
        </div>
      </div>

      {/* Steps Card */}
      <Card.Root
        variant="elevated"
        shadow="xl"
        className="rounded-2xl overflow-hidden"
      >
        <Card.Body className="p-8">
          <Steps.Root
            step={activeStep}
            count={steps.length}
            orientation="horizontal"
            className="mb-8"
          >
            <Steps.List>
              {steps.map((step, index) => (
                <Steps.Item key={index} index={index}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Icon as={step.icon} />
                    </Steps.Indicator>
                    <div className="flex flex-col items-center space-y-1">
                      <Steps.Title className="font-semibold">
                        {step.title}
                      </Steps.Title>
                      <Steps.Description className="text-gray-600 text-sm">
                        {step.description}
                      </Steps.Description>
                    </div>
                  </Steps.Trigger>
                  <Steps.Separator />
                </Steps.Item>
              ))}
            </Steps.List>

            {/* Contenido del Step 1: Crear Usuario */}
            <Steps.Content index={0}>
              <Card.Root variant="subtle" className="mt-8">
                <Card.Header>
                  <div className="flex items-center space-x-3">
                    <Icon as={IdCardIcon} color="blue.500" />
                    <Heading size="md">Información del Usuario</Heading>
                  </div>
                </Card.Header>
                <Card.Body>
                  <form
                    onSubmit={userForm.handleSubmit((data) =>
                      createUserMutation.mutate(data)
                    )}
                  >
                    <div className="space-y-6">
                      <Field.Root invalid={!!userForm.formState.errors.name}>
                        <Field.Label className="font-medium">
                          Nombre Completo *
                        </Field.Label>
                        <Input
                          placeholder="Ej: Juan Pérez"
                          size="lg"
                          className="rounded-lg"
                          {...userForm.register("name")}
                        />
                        <Field.ErrorText color="red.500">
                          {userForm.formState.errors.name?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!userForm.formState.errors.email}>
                        <Field.Label className="font-medium">
                          Email *
                        </Field.Label>
                        <Input
                          placeholder="usuario@ejemplo.com"
                          type="email"
                          size="lg"
                          className="rounded-lg"
                          {...userForm.register("email")}
                        />
                        <Field.ErrorText color="red.500">
                          {userForm.formState.errors.email?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root
                        invalid={!!userForm.formState.errors.password}
                      >
                        <Field.Label className="font-medium">
                          Contraseña *
                        </Field.Label>
                        <Input
                          placeholder="contraseñaSegura123"
                          type="password"
                          size="lg"
                          className="rounded-lg"
                          {...userForm.register("password")}
                        />
                        <Field.ErrorText color="red.500">
                          {userForm.formState.errors.password?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Button
                        type="submit"
                        loading={createUserMutation.isPending}
                        colorScheme="blue"
                        size="lg"
                        className="rounded-lg w-full"
                        loadingText="Creando usuario..."
                      >
                        Crear Usuario y Continuar
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card.Root>
            </Steps.Content>

            {/* Contenido del Step 2: Crear Driver */}
            <Steps.Content index={1}>
              <Card.Root variant="subtle" className="mt-8">
                <Card.Header>
                  <div className="flex items-center space-x-3">
                    <Icon as={UserIcon} color="blue.500" />
                    <Heading size="md">Información del Conductor</Heading>
                  </div>
                </Card.Header>
                <Card.Body>
                  <form
                    onSubmit={driverForm.handleSubmit((data) =>
                      createDriverMutation.mutate(data)
                    )}
                  >
                    <div className="space-y-6">
                      <Field.Root
                        invalid={!!driverForm.formState.errors.license}
                      >
                        <Field.Label className="font-medium">
                          Licencia de Conducir *
                        </Field.Label>
                        <Input
                          placeholder="Ej: ABC-123"
                          size="lg"
                          className="rounded-lg"
                          {...driverForm.register("license")}
                        />
                        <Field.ErrorText color="red.500">
                          {driverForm.formState.errors.license?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root
                        invalid={!!driverForm.formState.errors.assignedVehicle}
                      >
                        <Field.Label className="font-medium">
                          Vehículo Asignado (opcional)
                        </Field.Label>
                        <Input
                          placeholder="ID del vehículo"
                          size="lg"
                          className="rounded-lg"
                          {...driverForm.register("assignedVehicle")}
                        />
                        <Field.ErrorText color="red.500">
                          {driverForm.formState.errors.assignedVehicle?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Button
                        type="submit"
                        loading={createDriverMutation.isPending}
                        disabled={!userId}
                        colorScheme="blue"
                        size="lg"
                        className="rounded-lg w-full"
                        loadingText="Creando conductor..."
                      >
                        Crear Driver y Continuar
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card.Root>
            </Steps.Content>

            {/* Contenido del Step 3: Crear Vehicle */}
            <Steps.Content index={2}>
              <Card.Root variant="subtle" className="mt-8">
                <Card.Header>
                  <div className="flex items-center space-x-3">
                    <Icon as={CarIcon} color="blue.500" />
                    <Heading size="md">Información del Vehículo</Heading>
                  </div>
                </Card.Header>
                <Card.Body>
                  <form
                    onSubmit={vehicleForm.handleSubmit((data) =>
                      createVehicleMutation.mutate(data)
                    )}
                  >
                    <div className="space-y-6">
                      <Field.Root
                        invalid={!!vehicleForm.formState.errors.modelCar}
                      >
                        <Field.Label className="font-medium">
                          modelCar *
                        </Field.Label>
                        <Input
                          placeholder="Ej: Toyota Hilux 2023"
                          size="lg"
                          className="rounded-lg"
                          {...vehicleForm.register("modelCar")}
                        />
                        <Field.ErrorText color="red.500">
                          {vehicleForm.formState.errors.modelCar?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root
                        invalid={!!vehicleForm.formState.errors.plate}
                      >
                        <Field.Label className="font-medium">
                          Placa *
                        </Field.Label>
                        <Input
                          placeholder="Ej: ABC-123"
                          size="lg"
                          className="rounded-lg"
                          {...vehicleForm.register("plate")}
                        />
                        <Field.ErrorText color="red.500">
                          {vehicleForm.formState.errors.plate?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root
                        invalid={!!vehicleForm.formState.errors.fuelLevel}
                      >
                        <Field.Label className="font-medium">
                          Nivel de Combustible (0-100%) *
                        </Field.Label>
                        <Input
                          type="number"
                          placeholder="75"
                          size="lg"
                          className="rounded-lg"
                          {...vehicleForm.register("fuelLevel", {
                            valueAsNumber: true,
                          })}
                        />
                        <Field.ErrorText color="red.500">
                          {vehicleForm.formState.errors.fuelLevel?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <div className="grid grid-cols-2 gap-4">
                        <Field.Root
                          invalid={!!vehicleForm.formState.errors.latitude}
                        >
                          <Field.Label className="font-medium">
                            Latitud (opcional)
                          </Field.Label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="19.432608"
                            size="lg"
                            className="rounded-lg"
                            {...vehicleForm.register("latitude", {
                              valueAsNumber: true,
                            })}
                          />
                        </Field.Root>

                        <Field.Root
                          invalid={!!vehicleForm.formState.errors.longitude}
                        >
                          <Field.Label className="font-medium">
                            Longitud (opcional)
                          </Field.Label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="-99.133209"
                            size="lg"
                            className="rounded-lg"
                            {...vehicleForm.register("longitude", {
                              valueAsNumber: true,
                            })}
                          />
                        </Field.Root>
                      </div>

                      <Button
                        type="submit"
                        loading={createVehicleMutation.isPending}
                        disabled={!driverId}
                        colorScheme="blue"
                        size="lg"
                        className="rounded-lg w-full"
                        loadingText="Creando vehículo..."
                      >
                        Crear Vehicle y Finalizar
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card.Root>
            </Steps.Content>

            {/* Contenido del Step 4: Confirmación */}
            <Steps.Content index={3}>
              <div className="flex flex-col items-center space-y-8 py-12">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon
                    as={CheckIcon}
                    className="w-12 h-12"
                    color="green.500"
                  />
                </div>

                <div className="space-y-4 text-center">
                  <Heading size="lg" color="green.500">
                    ¡Proceso Completado!
                  </Heading>
                  <Text color="gray.600" fontSize="lg" className="max-w-md">
                    El usuario, conductor y vehículo han sido registrados
                    exitosamente en el sistema.
                  </Text>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleReset}
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    className="rounded-lg"
                  >
                    Crear Otro
                  </Button>
                  <Button colorScheme="green" size="lg" className="rounded-lg">
                    Ver Registros
                  </Button>
                </div>
              </div>
            </Steps.Content>

            <Steps.CompletedContent>
              <Text fontSize="lg" className="font-medium text-center">
                ¡Todos los pasos completados exitosamente!
              </Text>
            </Steps.CompletedContent>
          </Steps.Root>

          {/* Botones de navegación mejorados */}
          {activeStep < 3 && (
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                size="lg"
              >
                ← Anterior
              </Button>
              <Button
                variant="ghost"
                disabled={
                  activeStep >= steps.length - 1 ||
                  (activeStep === 0 && !userId) ||
                  (activeStep === 1 && !driverId)
                }
                onClick={() =>
                  setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                }
                size="lg"
              >
                Siguiente →
              </Button>
            </div>
          )}
        </Card.Body>
      </Card.Root>
    </Container>
  );
}

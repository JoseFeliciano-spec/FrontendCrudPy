// Archivo: components/drivers/DriversGrid.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axios } from "@/lib/axios";
import {
  Button,
  Heading,
  Input,
  Text,
  Card,
  Icon,
  Badge,
  Container,
  SimpleGrid,
  Box,
  Flex,
  Avatar,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  IconButton,
  Spinner,
  Alert,
  Field,
  Menu,
  Separator,
  For,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import {
  UserIcon,
  CarIcon,
  MoreVerticalIcon,
  PlusCircleIcon,
  XCircleIcon,
  IdCardIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  FuelIcon,
  MapPinIcon,
  ClockIcon,
  MailIcon,
} from "lucide-react";

// Esquema de validación para asignación de vehículo
const vehicleAssignSchema = yup.object({
  vehicleId: yup.string().required("El ID del vehículo es obligatorio"),
});

type VehicleAssignData = yup.InferType<typeof vehicleAssignSchema>;

// Interfaz que coincide exactamente con los datos de driversData
interface DriverData {
  driverId: string;
  idUser: string;
  idUserAdmin: string;
  vehicleId: string | null;
  license: string;
  assignedVehicle: string | null;
  driverCreatedAt: string;
  driverUpdatedAt: string;
  userName: string;
  userEmail: string;
  userRole: string;
  vehicleModel: string | null;
  vehiclePlate: string | null;
  vehicleFuelLevel: number | null;
  vehicleLatitude: number | null;
  vehicleLongitude: number | null;
  vehicleTemperature: number | null;
  vehicleSpeed: number | null;
  vehicleLastUpdate: string | null;
  hasVehicleAssigned: boolean;
  status: string;
  priority: "NORMAL" | "HIGH" | "CRITICAL";
  fuelAlert: string | null;
  fuelHoursRemaining: number | null;
  fuelCritical: boolean;
}

// Función para obtener color del badge según prioridad
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "CRITICAL":
      return "red";
    case "HIGH":
      return "orange";
    case "NORMAL":
      return "green";
    default:
      return "gray";
  }
};

// Función para formatear tiempo restante
const formatTimeRemaining = (hours: number | null) => {
  if (!hours) return null;
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

// Función para llamadas API
const apiCall = async (
  method: string,
  url: string,
  body?: any,
  token?: string
) => {
  if (!token) throw new Error("Token de autenticación requerido");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  switch (method) {
    case "GET":
      return await axios.get(url, config);
    case "PUT":
      return await axios.put(url, body, config);
    case "DELETE":
      return await axios.delete(url, config);
    default:
      throw new Error("Método no soportado");
  }
};

interface DriversGridProps {
  user: any; // Usuario autenticado con token
}

export default function DriversGrid({ user }: DriversGridProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [actionType, setActionType] = useState<"assign" | "remove">("assign");

  const isAdmin = user?.data?.role === "admin";

  // Query para obtener drivers - toda la información está en driversData
  const {
    data: driversData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["drivers", user?.data?.id],
    queryFn: async () => {
      const response = await apiCall(
        "GET",
        "/v1/drivers",
        undefined,
        user?.data?.token
      );
      return response.data;
    },
    enabled: !!user?.data?.token,
    refetchInterval: 30000, // Actualización cada 30 segundos para monitoreo IoT
    staleTime: 10000, // 10 segundos de cache
    retry: 3, // Reintentos para resiliencia
  });

  // Formulario para asignación de vehículo
  const vehicleForm = useForm<VehicleAssignData>({
    resolver: yupResolver(vehicleAssignSchema),
    defaultValues: { vehicleId: "" },
  });

  // Mutación para asignar vehículo
  const assignVehicleMutation = useMutation({
    mutationFn: async ({
      driverId,
      vehicleId,
    }: {
      driverId: string;
      vehicleId: string;
    }) => {
      const response = await apiCall(
        "PUT",
        `/v1/drivers/${driverId}`,
        {
          idUser: driverId,
          assignedVehicle: vehicleId,
        },
        user?.data?.token
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Vehículo asignado exitosamente", {
        duration: 3000,
        style: { background: "#48BB78", color: "white" },
      });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setOpen(false);
      vehicleForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al asignar vehículo", {
        duration: 3000,
        style: { background: "#F56565", color: "white" },
      });
    },
  });

  // Mutación para remover vehículo
  const removeVehicleMutation = useMutation({
    mutationFn: async (driverId: string) => {
      const response = await apiCall(
        "PUT",
        `/v1/drivers/${driverId}`,
        {
          idUser: driverId,
          assignedVehicle: null,
        },
        user?.data?.token
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Vehículo removido exitosamente", {
        duration: 3000,
        style: { background: "#48BB78", color: "white" },
      });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al remover vehículo", {
        duration: 3000,
        style: { background: "#F56565", color: "white" },
      });
    },
  });

  const handleOpenModal = (driver: DriverData, action: "assign" | "remove") => {
    setSelectedDriver(driver);
    setActionType(action);
    setOpen(true);
  };

  const handleAssignVehicle = (data: VehicleAssignData) => {
    if (selectedDriver) {
      assignVehicleMutation.mutate({
        driverId: selectedDriver.driverId,
        vehicleId: data.vehicleId,
      });
    }
  };

  const handleRemoveVehicle = () => {
    if (selectedDriver) {
      removeVehicleMutation.mutate(selectedDriver.driverId);
    }
  };

  // Calcular estadísticas usando toda la información de driversData
  const stats = driversData
    ? {
        total: driversData?.length,
        withVehicles: driversData?.filter(
          (d: DriverData) => d.hasVehicleAssigned
        ).length,
        criticalAlerts: driversData?.filter((d: DriverData) => d.fuelCritical)
          .length,
        highPriority: driversData?.filter(
          (d: DriverData) => d.priority === "HIGH"
        ).length,
      }
    : null;

  return (
    <Container maxW="container.xl" py={8}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header con estadísticas completas */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <div>
            <Heading
              size="xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Gestión de Conductores
            </Heading>
            <Text color="gray.600" fontSize="lg" mt={2}>
              Sistema de monitoreo IoT - Simon Movilidad
            </Text>
          </div>
        </Flex>

        {/* Estadísticas usando toda la información de driversData */}
        {stats && (
          <Flex gap={4} align="center" wrap="wrap">
            <Badge colorScheme="blue" px={3} py={1} rounded="full">
              {stats.total} conductores registrados
            </Badge>
            <Badge colorScheme="green" px={3} py={1} rounded="full">
              {stats.withVehicles} con vehículos
            </Badge>
            <Badge colorScheme="red" px={3} py={1} rounded="full">
              {stats.criticalAlerts} alertas críticas
            </Badge>
            <Badge colorScheme="orange" px={3} py={1} rounded="full">
              {stats.highPriority} prioridad alta
            </Badge>
          </Flex>
        )}
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Flex justify="center" align="center" h="300px">
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" mb={4} />
            <Text color="gray.500">Cargando conductores...</Text>
          </Box>
        </Flex>
      )}

      {/* Error State */}
      {error && (
        <Alert.Root status="error" rounded="lg" mb={6}>
          <Alert.Indicator />
          <Alert.Title>Error al cargar conductores</Alert.Title>
          <Alert.Description>
            <Button ml={4} size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </Alert.Description>
        </Alert.Root>
      )}

      {/* Drivers Grid usando TODA la información de driversData */}
      {driversData && driversData.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          <For each={driversData}>
            {(driver: DriverData) => (
              <Card.Root
                key={driver.driverId}
                variant="elevated"
                shadow="lg"
                _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                transition="all 0.2s"
                rounded="xl"
                overflow="hidden"
                borderTop={driver.fuelCritical ? "4px solid" : "none"}
                borderTopColor={driver.fuelCritical ? "red.500" : "transparent"}
              >
                <Card.Header p={4} pb={2}>
                  <Flex justify="space-between" align="flex-start">
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="lg" bg="blue.500">
                        <Avatar.Fallback>
                          <Icon as={UserIcon} fontSize="1.5rem" />
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="bold" fontSize="lg">
                          {driver.userName}
                        </Text>
                        <Flex align="center" gap={2}>
                          <Icon as={MailIcon} size="sm" color="gray.500" />
                          <Text color="gray.500" fontSize="sm">
                            {driver.userEmail}
                          </Text>
                        </Flex>
                        <Badge
                          colorScheme={
                            driver.userRole === "driver" ? "blue" : "purple"
                          }
                          size="sm"
                          mt={1}
                        >
                          {driver.userRole === "driver"
                            ? "Conductor"
                            : "Administrador"}
                        </Badge>
                      </Box>
                    </Flex>

                    <Badge
                      colorScheme={getPriorityColor(driver.priority)}
                      variant="solid"
                      rounded="full"
                    >
                      {driver.priority}
                    </Badge>
                  </Flex>
                </Card.Header>

                <Card.Body p={4} pt={0}>
                  {/* Alerta de Combustible Crítico usando datos completos */}
                  {driver.fuelCritical && driver.fuelAlert && (
                    <Alert.Root status="error" mb={4} rounded="lg">
                      <Alert.Indicator />
                      <Box>
                        <Alert.Title fontSize="sm">
                          🚨 Combustible Crítico
                        </Alert.Title>
                        <Alert.Description fontSize="xs">
                          {formatTimeRemaining(driver.fuelHoursRemaining)}{" "}
                          restantes
                        </Alert.Description>
                      </Box>
                    </Alert.Root>
                  )}

                  <Separator mb={4} />

                  {/* Información del Conductor usando datos completos */}
                  <Box mb={4}>
                    <Flex align="center" gap={2} mb={3}>
                      <Icon as={IdCardIcon} color="blue.500" />
                      <Text fontSize="sm" color="gray.600">
                        Licencia:
                      </Text>
                      <Badge colorScheme="blue" variant="subtle">
                        {driver.license}
                      </Badge>
                    </Flex>

                    <Flex align="center" gap={2} mb={3}>
                      <Icon
                        as={CarIcon}
                        color={
                          driver.hasVehicleAssigned ? "green.500" : "gray.400"
                        }
                      />
                      <Text fontSize="sm" color="gray.600">
                        Estado:
                      </Text>
                      <Badge
                        colorScheme={
                          driver.hasVehicleAssigned ? "green" : "orange"
                        }
                        variant="subtle"
                      >
                        {driver.status}
                      </Badge>
                    </Flex>

                    {/* Información COMPLETA del Vehículo de driversData */}
                    {driver.hasVehicleAssigned && driver.vehicleId && (
                      <Box
                        p={3}
                        bg="green.50"
                        rounded="lg"
                        border="1px"
                        borderColor="green.200"
                      >
                        <Text
                          fontSize="xs"
                          color="green.600"
                          mb={2}
                          fontWeight="bold"
                        >
                          🚗 VEHÍCULO ASIGNADO
                        </Text>

                        {driver.vehicleModel && (
                          <Flex align="center" gap={2} mb={1}>
                            <Icon as={CarIcon} size="sm" />
                            <Text fontSize="sm" fontWeight="medium">
                              {driver.vehicleModel}
                            </Text>
                          </Flex>
                        )}

                        {driver.vehiclePlate && (
                          <Flex align="center" gap={2} mb={1}>
                            <Text fontSize="sm" fontWeight="medium">
                              📋 Placa: {driver.vehiclePlate}
                            </Text>
                          </Flex>
                        )}

                        {driver.vehicleFuelLevel !== null && (
                          <Flex align="center" gap={2} mb={1}>
                            <Icon as={FuelIcon} size="sm" />
                            <Text
                              fontSize="sm"
                              color={
                                driver.vehicleFuelLevel < 15
                                  ? "red.600"
                                  : "green.700"
                              }
                              fontWeight={
                                driver.vehicleFuelLevel < 15 ? "bold" : "normal"
                              }
                            >
                              Combustible: {driver.vehicleFuelLevel}%
                            </Text>
                          </Flex>
                        )}

                        {driver.vehicleLatitude && driver.vehicleLongitude && (
                          <Flex align="center" gap={2} mb={1}>
                            <Icon as={MapPinIcon} size="sm" />
                            <Text fontSize="sm">
                              📍 GPS: {driver.vehicleLatitude.toFixed(4)},{" "}
                              {driver.vehicleLongitude.toFixed(4)}
                            </Text>
                          </Flex>
                        )}

                        {driver.vehicleLastUpdate && (
                          <Flex align="center" gap={2}>
                            <Icon as={ClockIcon} size="sm" />
                            <Text fontSize="xs" color="gray.600">
                              Última señal:{" "}
                              {new Date(
                                driver.vehicleLastUpdate
                              ).toLocaleString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Menu de Opciones */}
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="sm" w="full">
                        <Icon as={MoreVerticalIcon} mr={2} />
                        Opciones
                      </Button>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item
                        value="assign"
                        onClick={() => handleOpenModal(driver, "assign")}
                        disabled={driver.hasVehicleAssigned}
                      >
                        <Icon as={PlusCircleIcon} mr={2} />
                        Asignar Vehículo
                      </Menu.Item>
                      <Menu.Item
                        value="remove"
                        onClick={() => handleOpenModal(driver, "remove")}
                        disabled={!driver.hasVehicleAssigned}
                        color="red.500"
                      >
                        <Icon as={XCircleIcon} mr={2} />
                        Remover Vehículo
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Root>
                </Card.Body>
              </Card.Root>
            )}
          </For>
        </SimpleGrid>
      )}

      {/* Empty State */}
      {driversData?.data && driversData.data.length === 0 && (
        <Box textAlign="center" py={16}>
          <Icon as={UserIcon} fontSize="4rem" color="gray.300" mb={4} />
          <Heading size="md" color="gray.500" mb={2}>
            No hay conductores registrados
          </Heading>
          <Text color="gray.400" mb={6}>
            Comienza agregando tu primer conductor al sistema
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => (window.location.href = "/create-driver-vehicle")}
          >
            <Icon as={PlusCircleIcon} mr={2} />
            Crear Primer Conductor
          </Button>
        </Box>
      )}

      {/* Modal para Asignar/Remover Vehículo */}
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent rounded="xl">
          <DialogHeader>
            <Flex align="center" gap={3}>
              <Icon
                as={actionType === "assign" ? PlusCircleIcon : XCircleIcon}
                color={actionType === "assign" ? "blue.500" : "red.500"}
              />
              {actionType === "assign"
                ? "Asignar Vehículo"
                : "Remover Vehículo"}
            </Flex>
          </DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            {selectedDriver && (
              <Box>
                <Box p={4} bg="gray.50" rounded="lg" mb={4}>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    CONDUCTOR
                  </Text>
                  <Text fontWeight="medium">{selectedDriver.userName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    📧 {selectedDriver.userEmail}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    🆔 Licencia: {selectedDriver.license}
                  </Text>
                </Box>

                {actionType === "assign" ? (
                  <form
                    onSubmit={vehicleForm.handleSubmit(handleAssignVehicle)}
                  >
                    <Field.Root
                      invalid={!!vehicleForm.formState.errors.vehicleId}
                    >
                      <Field.Label>ID del Vehículo *</Field.Label>
                      <Input
                        placeholder="Ingresa el ID del vehículo"
                        size="lg"
                        {...vehicleForm.register("vehicleId")}
                      />
                      <Field.ErrorText>
                        {vehicleForm.formState.errors.vehicleId?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Flex gap={3} mt={6}>
                      <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        flex={1}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        loading={assignVehicleMutation.isPending}
                        flex={1}
                      >
                        Asignar
                      </Button>
                    </Flex>
                  </form>
                ) : (
                  <Box>
                    <Alert.Root status="warning" rounded="lg" mb={4}>
                      <Alert.Indicator />
                      <Alert.Title>Confirmación</Alert.Title>
                      <Alert.Description>
                        ¿Estás seguro de que deseas remover el vehículo asignado
                        a <strong>{selectedDriver.userName}</strong>?
                      </Alert.Description>
                    </Alert.Root>

                    <Flex gap={3}>
                      <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        flex={1}
                      >
                        Cancelar
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={handleRemoveVehicle}
                        loading={removeVehicleMutation.isPending}
                        flex={1}
                      >
                        Remover
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Box>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Container>
  );
}

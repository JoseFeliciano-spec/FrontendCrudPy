// Archivo: components/driver/DriverLocationSender.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Button,
  Text,
  Badge,
  Alert,
  Flex,
  Card,
  Icon,
  Heading,
  Container,
  Input,
  VStack,
  HStack,
  Slider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import {
  WifiIcon,
  WifiOffIcon,
  MapPinIcon,
  PlayIcon,
  PauseIcon,
  LocateIcon,
  NavigationIcon,
  SendIcon,
  RotateCcwIcon,
  Target,
  MapIcon,
} from "lucide-react";

// Configuración del ícono del marcador para Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Crear íconos personalizados
const createDriverIcon = (color: string) => {
  return L.divIcon({
    className: "custom-driver-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
        animation: pulse 2s infinite;
      ">🚗</div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Coordenadas de Cartagena y alrededores
const CARTAGENA_COORDS = {
  center: { lat: 10.391, lng: -75.4794 },
  bounds: {
    north: 10.5,
    south: 10.28,
    east: -75.35,
    west: -75.6,
  },
};

// Generar ubicación aleatoria en Cartagena y alrededores
const generateCartagenaLocation = () => {
  const lat =
    CARTAGENA_COORDS.bounds.south +
    Math.random() *
      (CARTAGENA_COORDS.bounds.north - CARTAGENA_COORDS.bounds.south);
  const lng =
    CARTAGENA_COORDS.bounds.west +
    Math.random() *
      (CARTAGENA_COORDS.bounds.east - CARTAGENA_COORDS.bounds.west);
  return { lat, lng };
};

// Interface para estado de ubicación
interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

// Interface para estado de simulación
interface SimulationState {
  isRunning: boolean;
  currentLat: number;
  currentLng: number;
  targetLat: number;
  targetLng: number;
  step: number;
  totalSteps: number;
}

// Interface para ubicaciones enviadas (historial)
interface SentLocation {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  type: "manual" | "gps" | "simulation";
}

// Componente para centrar el mapa en la ubicación actual
function MapController({
  currentLocation,
  shouldCenter,
}: {
  currentLocation: LocationState | null;
  shouldCenter: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (shouldCenter && currentLocation) {
      map.setView([currentLocation.latitude, currentLocation.longitude], 15);
    }
  }, [currentLocation, shouldCenter, map]);

  return null;
}

interface DriverLocationSenderProps {
  user: any;
  vehicleId: any;
}

export default function DriverLocationSender({
  user,
  vehicleId,
}: DriverLocationSenderProps) {
  // Estados principales
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationState | null>(
    null
  );
  const [sentLocations, setSentLocations] = useState<SentLocation[]>([]);
  const [autoCenter, setAutoCenter] = useState(true);

  const [manualLocation, setManualLocation] = useState({
    lat: CARTAGENA_COORDS.center.lat,
    lng: CARTAGENA_COORDS.center.lng,
  });

  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    currentLat: CARTAGENA_COORDS.center.lat,
    currentLng: CARTAGENA_COORDS.center.lng,
    targetLat: CARTAGENA_COORDS.center.lat + 0.01,
    targetLng: CARTAGENA_COORDS.center.lng + 0.01,
    step: 0,
    totalSteps: 20,
  });

  const [autoGPSEnabled, setAutoGPSEnabled] = useState(false);
  const [sendInterval, setSendInterval] = useState(5);

  // Referencias
  const socketRef = useRef<Socket | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSendIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationWatchId = useRef<number | null>(null);

  const isDriver = user?.data?.role === "driver";

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
      if (autoSendIntervalRef.current) {
        clearInterval(autoSendIntervalRef.current);
      }
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-envío integrado con GPS
  useEffect(() => {
    if (autoGPSEnabled && isConnected && currentLocation) {
      // Enviar inmediatamente cuando se obtiene nueva ubicación
      if (socketRef.current) {
        const locationData = {
          vehicleId: vehicleId,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };
        socketRef.current.emit("sendLocation", locationData);
        addSentLocation(currentLocation, "gps");
      }

      // Configurar envío periódico
      if (autoSendIntervalRef.current) {
        clearInterval(autoSendIntervalRef.current);
      }

      autoSendIntervalRef.current = setInterval(() => {
        if (currentLocation && socketRef.current) {
          const locationData = {
            vehicleId: vehicleId,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          };
          socketRef.current.emit("sendLocation", locationData);
          addSentLocation(currentLocation, "gps");
        }
      }, sendInterval * 1000);
    } else {
      if (autoSendIntervalRef.current) {
        clearInterval(autoSendIntervalRef.current);
        autoSendIntervalRef.current = null;
      }
    }

    return () => {
      if (autoSendIntervalRef.current) {
        clearInterval(autoSendIntervalRef.current);
      }
    };
  }, [autoGPSEnabled, isConnected, currentLocation, sendInterval]);

  // GPS automático con envío integrado
  useEffect(() => {
    if (autoGPSEnabled && navigator.geolocation) {
      const watchOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      };

      locationWatchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const location: LocationState = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
          setCurrentLocation(location);

          if (sentLocations.length === 0) {
            toast.success(
              "📍 GPS activado - Enviando ubicaciones automáticamente",
              {
                duration: 3000,
                style: { background: "#48BB78", color: "white" },
              }
            );
          }
        },
        (error) => {
          console.error("Error watching location:", error);
          toast.error("❌ Error en GPS: " + error.message);
          setAutoGPSEnabled(false);
        },
        watchOptions
      );
    } else {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;

        if (autoGPSEnabled === false) {
          toast.success("⏹️ GPS desactivado", {
            duration: 2000,
            style: { background: "#718096", color: "white" },
          });
        }
      }
    }

    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, [autoGPSEnabled, sentLocations.length]);

  // ✅ FUNCIÓN: Conectar al WebSocket
  const connectToServer = async () => {
    if (!isDriver) {
      toast.error("Solo drivers pueden conectarse");
      return;
    }

    if (!user?.data?.token) {
      toast.error("Token de autenticación requerido");
      return;
    }

    if (!vehicleId) {
      toast.error("ID de vehículo requerido");
      return;
    }

    setIsConnecting(true);

    try {
      const socket = io("http://localhost:8080/locations", {
        auth: { token: user.data.token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Conectado al WebSocket como driver");
        setIsConnected(true);
        setIsConnecting(false);

        toast.success("Conectado al sistema de monitoreo", {
          duration: 3000,
          style: { background: "#48BB78", color: "white" },
        });
      });

      socket.on("disconnect", () => {
        console.log("Desconectado del WebSocket");
        setIsConnected(false);
        toast.error("Conexión perdida", {
          duration: 3000,
          style: { background: "#F56565", color: "white" },
        });
      });

      socket.on("connect_error", (error) => {
        console.error("Error de conexión:", error);
        setIsConnecting(false);
        toast.error("Error de conexión: " + (error as Error).message, {
          duration: 5000,
          style: { background: "#F56565", color: "white" },
        });
      });

      socket.on("error", (errorData) => {
        console.error("Error del servidor:", errorData);
        toast.error(errorData.message || "Error del servidor", {
          duration: 3000,
          style: { background: "#F56565", color: "white" },
        });
      });
    } catch (error) {
      setIsConnecting(false);
      toast.error("Error al conectar: " + (error as Error).message);
    }
  };

  // ✅ FUNCIÓN: Desconectar del WebSocket
  const disconnectFromServer = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setAutoGPSEnabled(false);
    stopSimulation();
    toast.success("🔌 Desconectado del sistema");
  };

  // ✅ FUNCIÓN: Obtener ubicación actual del dispositivo
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no soportada en este dispositivo");
      return;
    }

    toast.promise(
      new Promise<LocationState>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: LocationState = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString(),
            };
            setCurrentLocation(location);
            resolve(location);
          },
          (error) => {
            reject(new Error("Error al obtener ubicación: " + error.message));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      }),
      {
        loading: "Obteniendo ubicación GPS...",
        success: (location: LocationState) =>
          `📍 Ubicación obtenida: ${location.latitude.toFixed(
            4
          )}, ${location.longitude.toFixed(4)}`,
        error: "❌ Error al obtener ubicación GPS",
      }
    );
  };

  // ✅ FUNCIÓN: Agregar ubicación al historial
  const addSentLocation = (
    location: LocationState,
    type: "manual" | "gps" | "simulation"
  ) => {
    const sentLocation: SentLocation = {
      id: Date.now().toString(),
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp,
      type,
    };

    setSentLocations((prev) => [sentLocation, ...prev.slice(0, 49)]);

    // Solo mostrar notificación para envíos manuales, no automáticos
    if (type === "manual") {
      toast.success(
        `🎯 Ubicación manual enviada: ${location.latitude.toFixed(
          4
        )}, ${location.longitude.toFixed(4)}`,
        {
          duration: 2000,
          style: { background: "#9F7AEA", color: "white" },
        }
      );
    }
  };

  // ✅ FUNCIÓN: Enviar ubicación actual al servidor
  const sendCurrentLocation = () => {
    if (!isConnected || !socketRef.current) {
      toast.error("No hay conexión al servidor");
      return;
    }

    if (!currentLocation) {
      toast.error("No hay ubicación disponible");
      return;
    }

    const locationData = {
      vehicleId: vehicleId,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };

    socketRef.current.emit("sendLocation", locationData);
    addSentLocation(currentLocation, "gps");

    toast.success(
      `📡 Ubicación enviada: ${currentLocation.latitude.toFixed(
        4
      )}, ${currentLocation.longitude.toFixed(4)}`,
      {
        duration: 2000,
        style: { background: "#4299E1", color: "white" },
      }
    );
  };

  // ✅ FUNCIÓN: Enviar ubicación manual
  const sendManualLocation = () => {
    if (!isConnected || !socketRef.current) {
      toast.error("No hay conexión al servidor");
      return;
    }

    const locationData = {
      vehicleId: vehicleId,
      latitude: manualLocation.lat,
      longitude: manualLocation.lng,
    };

    socketRef.current.emit("sendLocation", locationData);

    const manualLocationState: LocationState = {
      latitude: manualLocation.lat,
      longitude: manualLocation.lng,
      timestamp: new Date().toISOString(),
    };

    setCurrentLocation(manualLocationState);
    addSentLocation(manualLocationState, "manual");

    toast.success(
      `🎯 Ubicación manual enviada: ${manualLocation.lat.toFixed(
        4
      )}, ${manualLocation.lng.toFixed(4)}`,
      {
        duration: 2000,
        style: { background: "#9F7AEA", color: "white" },
      }
    );
  };

  // ✅ FUNCIÓN: Toggle GPS integrado
  const toggleAutoGPS = () => {
    if (!isConnected) {
      toast.error("❌ Conecta al servidor primero");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("❌ GPS no disponible en este dispositivo");
      return;
    }

    const newState = !autoGPSEnabled;
    setAutoGPSEnabled(newState);

    if (newState) {
      toast.loading("🔄 Activando GPS automático...", { duration: 2000 });
    }
  };

  // ✅ FUNCIÓN: Usar ubicación de prueba en Cartagena
  const useCartagenaTestLocation = () => {
    const testLocation = generateCartagenaLocation();
    const locationState: LocationState = {
      latitude: testLocation.lat,
      longitude: testLocation.lng,
      timestamp: new Date().toISOString(),
    };

    setCurrentLocation(locationState);
    setManualLocation({ lat: testLocation.lat, lng: testLocation.lng });

    toast.success(
      `🏖️ Ubicación de prueba en Cartagena: ${testLocation.lat.toFixed(
        4
      )}, ${testLocation.lng.toFixed(4)}`,
      {
        duration: 3000,
        style: { background: "#F6AD55", color: "white" },
      }
    );
  };

  // ✅ FUNCIÓN: Iniciar simulación de recorrido en Cartagena
  const startSimulation = () => {
    if (!isConnected) {
      toast.error("Conecta al servidor primero");
      return;
    }

    // Generar destino aleatorio en Cartagena
    const randomDestination = generateCartagenaLocation();

    const newSimulation: SimulationState = {
      isRunning: true,
      currentLat: currentLocation?.latitude || CARTAGENA_COORDS.center.lat,
      currentLng: currentLocation?.longitude || CARTAGENA_COORDS.center.lng,
      targetLat: randomDestination.lat,
      targetLng: randomDestination.lng,
      step: 0,
      totalSteps: 20,
    };

    setSimulation(newSimulation);

    toast.success(
      `🚗 Recorrido iniciado en Cartagena hacia: ${randomDestination.lat.toFixed(
        4
      )}, ${randomDestination.lng.toFixed(4)}`,
      {
        duration: 3000,
        style: { background: "#38B2AC", color: "white" },
      }
    );

    // Simular movimiento gradual
    simulationIntervalRef.current = setInterval(() => {
      setSimulation((prev) => {
        if (prev.step >= prev.totalSteps) {
          clearInterval(simulationIntervalRef.current!);
          toast.success("🏁 Recorrido completado en Cartagena");
          return { ...prev, isRunning: false };
        }

        const progress = (prev.step + 1) / prev.totalSteps;
        const currentLat =
          prev.currentLat + (prev.targetLat - prev.currentLat) * progress;
        const currentLng =
          prev.currentLng + (prev.targetLng - prev.currentLng) * progress;

        const simulationLocation: LocationState = {
          latitude: currentLat,
          longitude: currentLng,
          timestamp: new Date().toISOString(),
        };

        // Enviar ubicación automáticamente durante simulación
        if (socketRef.current) {
          socketRef.current.emit("sendLocation", {
            vehicleId: vehicleId,
            latitude: currentLat,
            longitude: currentLng,
          });
        }

        setCurrentLocation(simulationLocation);
        addSentLocation(simulationLocation, "simulation");

        return {
          ...prev,
          step: prev.step + 1,
          currentLat,
          currentLng,
        };
      });
    }, 2000);
  };

  // ✅ FUNCIÓN: Detener simulación
  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setSimulation((prev) => ({ ...prev, isRunning: false }));
    toast.success("⏹️ Simulación detenida");
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <Box mb={6}>
        <Heading
          size="xl"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          mb={2}
        >
          Driver - Envío de Ubicaciones
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Sistema IoT - Mapa Movilidad - Cartagena 🇨🇴
        </Text>
        <Flex gap={2} align="center" mt={2}>
          <Badge colorScheme="blue">Vehículo: {vehicleId}</Badge>
          {autoGPSEnabled && (
            <Badge colorScheme="green" variant="solid">
              📍 GPS ACTIVO
            </Badge>
          )}
        </Flex>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        <GridItem>
          {/* Estado de Conexión */}
          <Card.Root mb={6} variant="elevated">
            <Card.Header>
              <Flex justify="space-between" align="center">
                <Heading size="md">Estado de Conexión</Heading>
                <Badge
                  colorScheme={isConnected ? "green" : "red"}
                  variant="solid"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={isConnected ? WifiIcon : WifiOffIcon} />
                  {isConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </Flex>
            </Card.Header>
            <Card.Body>
              <HStack gap={4} mb={4}>
                <Button
                  colorScheme="green"
                  onClick={connectToServer}
                  disabled={isConnected || isConnecting}
                  loading={isConnecting}
                  loadingText="Conectando..."
                  size="sm"
                >
                  <Icon as={WifiIcon} mr={2} />
                  Conectar
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={disconnectFromServer}
                  disabled={!isConnected}
                  size="sm"
                >
                  <Icon as={WifiOffIcon} mr={2} />
                  Desconectar
                </Button>
              </HStack>

              <Button
                colorScheme="orange"
                variant="outline"
                onClick={useCartagenaTestLocation}
                size="sm"
                w="full"
              >
                🏖️ Usar Ubicación de Prueba (Cartagena)
              </Button>
            </Card.Body>
          </Card.Root>

          {/* GPS Automático */}
          <Card.Root
            mb={6}
            variant="elevated"
            borderColor={autoGPSEnabled ? "green.200" : "gray.200"}
            borderWidth="2px"
          >
            <Card.Header>
              <Flex justify="space-between" align="center">
                <Heading size="md">GPS Automático</Heading>
                <Badge
                  colorScheme={autoGPSEnabled ? "green" : "gray"}
                  variant="solid"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={autoGPSEnabled ? LocateIcon : MapPinIcon} />
                  {autoGPSEnabled ? "ACTIVO" : "INACTIVO"}
                </Badge>
              </Flex>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <Button
                  size="lg"
                  colorScheme={autoGPSEnabled ? "red" : "green"}
                  onClick={toggleAutoGPS}
                  disabled={!isConnected}
                  w="full"
                >
                  <Icon as={autoGPSEnabled ? PauseIcon : PlayIcon} mr={2} />
                  {autoGPSEnabled
                    ? "🛑 Detener GPS Automático"
                    : "▶️ Iniciar GPS Automático"}
                </Button>

                {currentLocation ? (
                  <Box
                    p={4}
                    bg={autoGPSEnabled ? "green.50" : "gray.50"}
                    rounded="lg"
                    border="1px"
                    borderColor={autoGPSEnabled ? "green.200" : "gray.200"}
                  >
                    <Text
                      fontSize="sm"
                      color={autoGPSEnabled ? "green.600" : "gray.600"}
                      mb={2}
                      fontWeight="bold"
                    >
                      {autoGPSEnabled
                        ? "📍 ENVIANDO AUTOMÁTICAMENTE"
                        : "📍 UBICACIÓN DISPONIBLE"}
                    </Text>
                    <Text fontSize="sm">
                      Lat: {currentLocation.latitude.toFixed(6)}
                    </Text>
                    <Text fontSize="sm">
                      Lng: {currentLocation.longitude.toFixed(6)}
                    </Text>
                    {currentLocation.accuracy && (
                      <Text fontSize="xs" color="gray.600">
                        Precisión: ±{currentLocation.accuracy.toFixed(0)}m
                      </Text>
                    )}
                    <Text fontSize="xs" color="gray.600">
                      {new Date(currentLocation.timestamp).toLocaleString()}
                    </Text>
                  </Box>
                ) : (
                  <Text color="gray.500" textAlign="center">
                    {autoGPSEnabled
                      ? "🔄 Obteniendo ubicación GPS..."
                      : "📍 No hay ubicación disponible"}
                  </Text>
                )}

                <Box>
                  <Text mb={2} fontSize="sm">
                    Intervalo de envío: <strong>{sendInterval}s</strong>
                  </Text>
                  <Slider.Root
                    value={[sendInterval]}
                    onValueChange={(details) =>
                      setSendInterval(details.value[0])
                    }
                    min={2}
                    max={30}
                    step={1}
                    disabled={autoGPSEnabled}
                  >
                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                      <Slider.Thumb index={0} />
                    </Slider.Control>
                  </Slider.Root>
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    {autoGPSEnabled
                      ? "⚠️ Desactiva GPS para cambiar intervalo"
                      : "Configura antes de activar GPS"}
                  </Text>
                </Box>

                {autoGPSEnabled && (
                  <Alert.Root status="success" rounded="lg">
                    <Alert.Indicator />
                    <Alert.Description fontSize="sm">
                      GPS activo - Enviando ubicación cada {sendInterval}s
                      automáticamente
                    </Alert.Description>
                  </Alert.Root>
                )}

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Controles Manuales:
                  </Text>
                  <HStack gap={2}>
                    <Button
                      colorScheme="blue"
                      onClick={getCurrentLocation}
                      size="sm"
                      flex={1}
                      disabled={autoGPSEnabled}
                    >
                      <Icon as={LocateIcon} mr={2} />
                      Obtener GPS Una Vez
                    </Button>
                    <Button
                      colorScheme="purple"
                      onClick={sendCurrentLocation}
                      disabled={
                        !isConnected || !currentLocation || autoGPSEnabled
                      }
                      size="sm"
                      flex={1}
                    >
                      <Icon as={SendIcon} mr={2} />
                      Enviar Manual
                    </Button>
                  </HStack>
                  {autoGPSEnabled && (
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Los controles manuales están deshabilitados mientras GPS
                      automático está activo
                    </Text>
                  )}
                </VStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Simulación */}
          <Card.Root mb={6} variant="elevated">
            <Card.Header>
              <Heading size="md">Simulación Cartagena</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <Text color="gray.600" fontSize="sm">
                  Simula recorrido por Cartagena y alrededores
                </Text>

                {simulation.isRunning && (
                  <Box>
                    <Text mb={2} fontSize="sm">
                      Progreso: {simulation.step}/{simulation.totalSteps}
                    </Text>
                    <Box w="full" bg="gray.200" rounded="full" h="2">
                      <Box
                        bg="teal.500"
                        h="full"
                        rounded="full"
                        width={`${
                          (simulation.step / simulation.totalSteps) * 100
                        }%`}
                        transition="width 0.3s"
                      />
                    </Box>
                    <Text fontSize="xs" color="gray.600" mt={2}>
                      Destino: {simulation.targetLat.toFixed(4)},{" "}
                      {simulation.targetLng.toFixed(4)}
                    </Text>
                  </Box>
                )}

                <HStack gap={2}>
                  <Button
                    colorScheme="teal"
                    onClick={startSimulation}
                    disabled={!isConnected || simulation.isRunning}
                    size="sm"
                    flex={1}
                  >
                    <Icon as={PlayIcon} mr={2} />
                    Iniciar
                  </Button>
                  <Button
                    colorScheme="orange"
                    variant="outline"
                    onClick={stopSimulation}
                    disabled={!simulation.isRunning}
                    size="sm"
                    flex={1}
                  >
                    <Icon as={PauseIcon} mr={2} />
                    Parar
                  </Button>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Ubicación Manual */}
          <Card.Root variant="elevated">
            <Card.Header>
              <Heading size="md">Ubicación Manual</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <HStack gap={4}>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm">
                      Latitud
                    </Text>
                    <Input
                      type="number"
                      step="0.000001"
                      value={manualLocation.lat}
                      onChange={(e) =>
                        setManualLocation((prev) => ({
                          ...prev,
                          lat: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="10.3910"
                      size="sm"
                    />
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm">
                      Longitud
                    </Text>
                    <Input
                      type="number"
                      step="0.000001"
                      value={manualLocation.lng}
                      onChange={(e) =>
                        setManualLocation((prev) => ({
                          ...prev,
                          lng: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="-75.4794"
                      size="sm"
                    />
                  </Box>
                </HStack>

                <HStack gap={2}>
                  <Button
                    colorScheme="purple"
                    onClick={sendManualLocation}
                    disabled={!isConnected}
                    size="sm"
                    flex={1}
                  >
                    <Icon as={NavigationIcon} mr={2} />
                    Enviar Manual
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setManualLocation({
                        lat: CARTAGENA_COORDS.center.lat,
                        lng: CARTAGENA_COORDS.center.lng,
                      })
                    }
                    size="sm"
                  >
                    <Icon as={RotateCcwIcon} mr={2} />
                    Reset
                  </Button>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Mapa - Columna Derecha */}
        <GridItem>
          <Card.Root variant="elevated" h="fit-content">
            <Card.Header>
              <Flex justify="space-between" align="center">
                <Heading size="md">Mapa - Cartagena</Heading>
                <HStack gap={2}>
                  <Badge
                    colorScheme={autoGPSEnabled ? "green" : "blue"}
                    fontSize="xs"
                  >
                    {autoGPSEnabled ? "📡 ENVIANDO" : "📍"}{" "}
                    {sentLocations.length} enviadas
                  </Badge>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setAutoCenter(!autoCenter)}
                  >
                    <Icon as={Target} mr={1} />
                    {autoCenter ? "Auto" : "Manual"}
                  </Button>
                </HStack>
              </Flex>
            </Card.Header>
            <Card.Body p={0}>
              <Box h="500px" w="full">
                <MapContainer
                  center={[
                    CARTAGENA_COORDS.center.lat,
                    CARTAGENA_COORDS.center.lng,
                  ]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapController
                    currentLocation={currentLocation}
                    shouldCenter={autoCenter}
                  />

                  {/* Marcador de ubicación actual */}
                  {currentLocation && (
                    <>
                      <Marker
                        position={[
                          currentLocation.latitude,
                          currentLocation.longitude,
                        ]}
                        icon={createDriverIcon("#3182CE")}
                      >
                        <Popup>
                          <Box p={2}>
                            <Text fontWeight="bold" mb={2}>
                              🚗 Tu Ubicación Actual
                            </Text>
                            <Text fontSize="sm">
                              Lat: {currentLocation.latitude.toFixed(6)}
                            </Text>
                            <Text fontSize="sm">
                              Lng: {currentLocation.longitude.toFixed(6)}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {new Date(
                                currentLocation.timestamp
                              ).toLocaleString()}
                            </Text>
                            {currentLocation.accuracy && (
                              <Text fontSize="xs" color="blue.600">
                                Precisión: ±
                                {currentLocation.accuracy.toFixed(0)}m
                              </Text>
                            )}
                          </Box>
                        </Popup>
                      </Marker>

                      {/* Círculo de precisión */}
                      {currentLocation.accuracy && (
                        <Circle
                          center={[
                            currentLocation.latitude,
                            currentLocation.longitude,
                          ]}
                          radius={currentLocation.accuracy}
                          pathOptions={{
                            color: "#3182CE",
                            fillColor: "#3182CE",
                            fillOpacity: 0.1,
                            weight: 2,
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Marcadores de ubicaciones enviadas (historial) */}
                  {sentLocations.slice(0, 20).map((location, index) => {
                    const colors = {
                      manual: "#9F7AEA",
                      gps: "#4299E1",
                      simulation: "#38B2AC",
                    };

                    return (
                      <Marker
                        key={location.id}
                        position={[location.latitude, location.longitude]}
                        icon={L.divIcon({
                          className: "sent-location-marker",
                          html: `
                            <div style="
                              background-color: ${colors[location.type]};
                              width: 12px;
                              height: 12px;
                              border-radius: 50%;
                              border: 2px solid white;
                              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                              opacity: ${1 - index * 0.05};
                            "></div>
                          `,
                          iconSize: [16, 16],
                          iconAnchor: [8, 8],
                        })}
                      >
                        <Popup>
                          <Box p={2}>
                            <Text fontWeight="bold" mb={1} fontSize="sm">
                              {location.type === "manual" &&
                                "🎯 Ubicación Manual"}
                              {location.type === "gps" && "📍 Ubicación GPS"}
                              {location.type === "simulation" &&
                                "🚗 Simulación"}
                            </Text>
                            <Text fontSize="xs">
                              Lat: {location.latitude.toFixed(6)}
                            </Text>
                            <Text fontSize="xs">
                              Lng: {location.longitude.toFixed(6)}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {new Date(location.timestamp).toLocaleString()}
                            </Text>
                          </Box>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Historial de Ubicaciones Enviadas */}
          {sentLocations.length > 0 && (
            <Card.Root mt={4} variant="elevated">
              <Card.Header>
                <Flex justify="space-between" align="center">
                  <Heading size="sm">Ubicaciones Enviadas</Heading>
                  {autoGPSEnabled && (
                    <Badge colorScheme="green" size="sm">
                      🔄 Actualizando automáticamente
                    </Badge>
                  )}
                </Flex>
              </Card.Header>
              <Card.Body>
                <VStack align="stretch" gap={2} maxH="200px" overflowY="auto">
                  {sentLocations.slice(0, 10).map((location, index) => (
                    <Box
                      key={location.id}
                      p={2}
                      bg={
                        location.type === "gps" && autoGPSEnabled
                          ? "green.50"
                          : "gray.50"
                      }
                      rounded="md"
                      fontSize="xs"
                      borderLeft={
                        location.type === "gps" && autoGPSEnabled
                          ? "3px solid"
                          : undefined
                      }
                      borderLeftColor="green.400"
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="bold">
                          {location.type === "manual" && "🎯 Manual"}
                          {location.type === "gps" && "📍 GPS Auto"}
                          {location.type === "simulation" && "🚗 Simulación"}
                        </Text>
                        <Text color="gray.600">
                          {new Date(location.timestamp).toLocaleTimeString()}
                        </Text>
                      </Flex>
                      <Text color="gray.700">
                        {location.latitude.toFixed(4)},{" "}
                        {location.longitude.toFixed(4)}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}

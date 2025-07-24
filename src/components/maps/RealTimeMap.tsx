// Archivo: components/maps/RealTimeMap.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { io, Socket } from "socket.io-client";
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
  Spinner,
  Field,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import {
  MapPinIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  WifiIcon,
  WifiOffIcon,
  RouteIcon,
  Target, // ✅ Cambiado de CenterFocusIcon a Target
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

// Crear íconos personalizados para diferentes estados
const createVehicleIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
      ">🚗</div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

// Interfaz para ubicaciones GPS recibidas del WebSocket
interface LocationData {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

// Interfaz para vehículo con historial
interface VehicleData {
  id: string;
  currentLocation: LocationData;
  locationHistory: LocationData[];
  lastUpdate: string;
  isActive: boolean;
}

// Interfaz para alertas predictivas
interface Alert {
  message: string;
  timestamp: string;
  vehicleId?: string;
}

// Componente para manejar acciones manuales del mapa (SIN auto-zoom)
function MapController({ vehicles }: { vehicles: Map<string, VehicleData> }) {
  const map = useMap();

  // Función para centrar manualmente en todos los vehículos
  const centerOnAllVehicles = () => {
    if (vehicles.size > 0) {
      const locations = Array.from(vehicles.values()).map(
        (vehicle) =>
          [
            vehicle.currentLocation.latitude,
            vehicle.currentLocation.longitude,
          ] as [number, number]
      );

      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  };

  // Exponer la función para uso externo
  (window as any).centerMapOnVehicles = centerOnAllVehicles;

  return null;
}

// Componente Switch personalizado para compatibilidad - ✅ CORREGIDO
interface CustomSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  colorScheme?: string;
  children?: React.ReactNode;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  isChecked,
  onChange,
  colorScheme = "blue",
  children,
}) => {
  return (
    <Flex align="center" gap={2}>
      <Box
        as="button"
        w="44px"
        h="24px"
        bg={isChecked ? `${colorScheme}.500` : "gray.300"}
        borderRadius="full"
        position="relative"
        cursor="pointer"
        transition="background-color 0.2s"
        onClick={() => onChange(!isChecked)}
        _hover={{
          bg: isChecked ? `${colorScheme}.600` : "gray.400",
        }}
      >
        <Box
          w="20px"
          h="20px"
          bg="white"
          borderRadius="full"
          position="absolute"
          top="2px"
          left={isChecked ? "22px" : "2px"}
          transition="left 0.2s"
          boxShadow="0 2px 4px rgba(0,0,0,0.2)"
        />
      </Box>
      {/* ✅ CORREGIDO: Envolver children en un solo elemento */}
      {children && <Text fontSize="sm">{children}</Text>}
    </Flex>
  );
};

interface RealTimeMapProps {
  user: any;
}

export default function RealTimeMap({ user }: RealTimeMapProps) {
  const [vehicles, setVehicles] = useState<Map<string, VehicleData>>(new Map());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrails, setShowTrails] = useState(false);
  const [maxHistoryPoints, setMaxHistoryPoints] = useState(50);
  const socketRef = useRef<Socket | null>(null);

  const isAdmin = user?.data?.role === "admin";

  // Función para actualizar o agregar vehículo
  const updateVehicleLocation = (newLocation: LocationData) => {
    setVehicles((prevVehicles) => {
      const newVehicles = new Map(prevVehicles);
      const existingVehicle = newVehicles.get(newLocation.vehicleId);

      if (existingVehicle) {
        const updatedHistory = [
          ...existingVehicle.locationHistory,
          existingVehicle.currentLocation,
        ];
        if (updatedHistory.length > maxHistoryPoints) {
          updatedHistory.splice(0, updatedHistory.length - maxHistoryPoints);
        }

        newVehicles.set(newLocation.vehicleId, {
          ...existingVehicle,
          currentLocation: newLocation,
          locationHistory: updatedHistory,
          lastUpdate: newLocation.timestamp,
          isActive: true,
        });
      } else {
        newVehicles.set(newLocation.vehicleId, {
          id: newLocation.vehicleId,
          currentLocation: newLocation,
          locationHistory: [],
          lastUpdate: newLocation.timestamp,
          isActive: true,
        });
      }

      return newVehicles;
    });
  };

  // Función para marcar vehículos inactivos
  const markInactiveVehicles = () => {
    const now = new Date().getTime();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutos

    setVehicles((prevVehicles) => {
      const newVehicles = new Map(prevVehicles);
      let hasChanges = false;

      newVehicles.forEach((vehicle, vehicleId) => {
        const lastUpdateTime = new Date(vehicle.lastUpdate).getTime();
        const isActive = now - lastUpdateTime < inactiveThreshold;

        if (vehicle.isActive !== isActive) {
          newVehicles.set(vehicleId, { ...vehicle, isActive });
          hasChanges = true;
        }
      });

      return hasChanges ? newVehicles : prevVehicles;
    });
  };

  // Función para centrar mapa manualmente
  const centerMapOnAllVehicles = () => {
    if ((window as any).centerMapOnVehicles) {
      (window as any).centerMapOnVehicles();
      toast.success("Mapa centrado en todos los vehículos", {
        duration: 2000,
        style: { background: "#4299E1", color: "white" },
      });
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setError(
        "Acceso denegado: Solo administradores pueden ver el mapa en tiempo real"
      );
      setIsLoading(false);
      return;
    }

    if (!user?.data?.token) {
      setError("Token de autenticación requerido");
      setIsLoading(false);
      return;
    }

    const socket = io("http://localhost:8080/locations", {
      auth: { token: user.data.token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Conectado al WebSocket de ubicaciones");
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
      socket.emit("requestLocations");

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
      setError("Error de conexión al servidor");
      setIsLoading(false);
      toast.error("Error de conexión", {
        duration: 3000,
        style: { background: "#F56565", color: "white" },
      });
    });

    socket.on("allLocations", (data: LocationData[]) => {
      console.log("Ubicaciones recibidas:", data);
      data.forEach((location) => {
        updateVehicleLocation(location);
      });
    });

    socket.on("newLocation", (data: LocationData) => {
      console.log("Nueva ubicación:", data);
      updateVehicleLocation(data);

      // Notificación más sutil para múltiples vehículos
      toast(`🚗 ${data.vehicleId} actualizado`, {
        duration: 1500,
        style: {
          background: "#EDF2F7",
          color: "#2D3748",
          fontSize: "12px",
        },
      });
    });

    socket.on("alert", (alertData: Alert) => {
      console.log("Alerta recibida:", alertData);
      const newAlert = {
        ...alertData,
        timestamp: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);

      toast.error(alertData.message, {
        duration: 5000,
        style: { background: "#E53E3E", color: "white" },
      });
    });

    socket.on("error", (errorData) => {
      console.error("Error del servidor:", errorData);
      toast.error(errorData.message || "Error del servidor", {
        duration: 3000,
        style: { background: "#F56565", color: "white" },
      });
    });

    const inactiveCheckInterval = setInterval(markInactiveVehicles, 30000);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      clearInterval(inactiveCheckInterval);
    };
  }, [user, isAdmin]);

  const requestRefresh = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("requestLocations");
      toast.success("Solicitando actualización...", {
        duration: 2000,
        style: { background: "#4299E1", color: "white" },
      });
    }
  };

  const clearHistory = () => {
    setVehicles((prevVehicles) => {
      const newVehicles = new Map();
      prevVehicles.forEach((vehicle, vehicleId) => {
        newVehicles.set(vehicleId, {
          ...vehicle,
          locationHistory: [],
        });
      });
      return newVehicles;
    });
    toast.success("Historial de rutas limpiado", {
      duration: 2000,
      style: { background: "#4299E1", color: "white" },
    });
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" h="400px">
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" mb={4} />
            <Text color="gray.500">Conectando al sistema de monitoreo...</Text>
          </Box>
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert.Root status="error" rounded="lg">
          <Alert.Indicator />
          <Alert.Title>Error de Conexión</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header del Dashboard */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <div>
            <Heading
              size="xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Monitoreo en Tiempo Real
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Sistema IoT - Mapa Movilidad - Cartagena 🇨🇴
            </Text>
          </div>

          <Flex gap={3} align="center" wrap="wrap">
            {/* Estado de conexión */}
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

            {/* Toggle para mostrar trazabilidad - ✅ CORREGIDO */}
            <Field.Root>
              <Flex align="center" gap={2}>
                <Icon as={RouteIcon} />
                <CustomSwitch
                  isChecked={showTrails}
                  onChange={(checked: boolean) => setShowTrails(checked)}
                  colorScheme="blue"
                >
                  Rutas
                </CustomSwitch>
              </Flex>
            </Field.Root>

            {/* Botón para centrar mapa manualmente - ✅ ÍCONO CORREGIDO */}
            <Button
              size="sm"
              variant="outline"
              onClick={centerMapOnAllVehicles}
              disabled={!isConnected || vehicles.size === 0}
              title="Centrar mapa en todos los vehículos"
            >
              <Icon as={Target} mr={2} />
              Centrar
            </Button>

            {/* Botón para limpiar historial */}
            {showTrails && (
              <Button
                size="sm"
                variant="outline"
                onClick={clearHistory}
                disabled={!isConnected}
              >
                Limpiar Rutas
              </Button>
            )}

            {/* Botón de actualización */}
            <Button
              size="sm"
              variant="outline"
              onClick={requestRefresh}
              disabled={!isConnected}
            >
              <Icon as={RefreshCwIcon} mr={2} />
              Actualizar
            </Button>
          </Flex>
        </Flex>

        {/* Estadísticas mejoradas para múltiples vehículos */}
        <Flex gap={4} wrap="wrap">
          <Badge colorScheme="blue" px={3} py={1} rounded="full" fontSize="sm">
            🚗 {Array.from(vehicles.values()).filter((v) => v.isActive).length}{" "}
            activos
          </Badge>
          <Badge colorScheme="gray" px={3} py={1} rounded="full" fontSize="sm">
            ⏸️ {Array.from(vehicles.values()).filter((v) => !v.isActive).length}{" "}
            inactivos
          </Badge>
          <Badge
            colorScheme="purple"
            px={3}
            py={1}
            rounded="full"
            fontSize="sm"
          >
            📍 {vehicles.size} total vehículos
          </Badge>
          <Badge colorScheme="red" px={3} py={1} rounded="full" fontSize="sm">
            🚨 {alerts.length} alertas
          </Badge>
        </Flex>
      </Box>

      {/* Alertas predictivas */}
      {alerts.length > 0 && (
        <Box mb={6}>
          <Heading size="md" mb={3} color="red.500">
            🚨 Alertas Predictivas
          </Heading>
          <Flex direction="column" gap={2}>
            {alerts.slice(0, 3).map((alert, index) => (
              <Alert.Root key={index} status="error" rounded="lg">
                <Alert.Indicator />
                <Box>
                  <Alert.Title fontSize="sm">Alerta del Sistema</Alert.Title>
                  <Alert.Description fontSize="sm">
                    {alert.message}
                  </Alert.Description>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </Text>
                </Box>
              </Alert.Root>
            ))}
          </Flex>
        </Box>
      )}

      {/* Mapa principal - ✅ CENTRADO EN CARTAGENA */}
      <Card.Root rounded="xl" overflow="hidden" shadow="lg">
        <Card.Body p={0}>
          <Box h="600px" w="full">
            <MapContainer
              center={[10.391, -75.4794]} // ✅ Cartagena, Colombia
              zoom={12} // Zoom más cercano para ciudad
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Controller sin auto-zoom */}
              <MapController vehicles={vehicles} />

              {/* Rutas de vehículos */}
              {showTrails &&
                Array.from(vehicles.values()).map((vehicle) => {
                  if (vehicle.locationHistory.length < 2) return null;

                  const routePoints = [
                    ...vehicle.locationHistory.map(
                      (loc) => [loc.latitude, loc.longitude] as [number, number]
                    ),
                    [
                      vehicle.currentLocation.latitude,
                      vehicle.currentLocation.longitude,
                    ] as [number, number],
                  ];

                  return (
                    <Polyline
                      key={`route-${vehicle.id}`}
                      positions={routePoints}
                      pathOptions={{
                        color: vehicle.isActive ? "#3182CE" : "#A0AEC0",
                        weight: 3,
                        opacity: 0.7,
                        dashArray: vehicle.isActive ? undefined : "5, 10",
                      }}
                    />
                  );
                })}

              {/* Marcadores de vehículos - UNO POR VEHÍCULO */}
              {Array.from(vehicles.values()).map((vehicle) => (
                <Marker
                  key={`vehicle-${vehicle.id}`}
                  position={[
                    vehicle.currentLocation.latitude,
                    vehicle.currentLocation.longitude,
                  ]}
                  icon={createVehicleIcon(
                    vehicle.isActive ? "#3182CE" : "#A0AEC0"
                  )}
                >
                  <Popup>
                    <Box p={2}>
                      <Text fontWeight="bold" mb={2}>
                        🚗 Vehículo {vehicle.currentLocation.vehicleId}
                      </Text>
                      <Badge
                        colorScheme={vehicle.isActive ? "green" : "gray"}
                        size="sm"
                        mb={2}
                      >
                        {vehicle.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Text fontSize="sm" mb={1}>
                        📍 Lat: {vehicle.currentLocation.latitude.toFixed(6)}
                      </Text>
                      <Text fontSize="sm" mb={1}>
                        📍 Lon: {vehicle.currentLocation.longitude.toFixed(6)}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        🕒{" "}
                        {new Date(
                          vehicle.currentLocation.timestamp
                        ).toLocaleString()}
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        📊 {vehicle.locationHistory.length} puntos registrados
                      </Text>
                      <Badge colorScheme="blue" size="sm" mt={2}>
                        ID: {vehicle.currentLocation.id}
                      </Badge>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Card.Body>
      </Card.Root>

      {/* Estado sin ubicaciones */}
      {vehicles.size === 0 && isConnected && (
        <Box textAlign="center" py={8}>
          <Icon as={MapPinIcon} fontSize="3rem" color="gray.400" mb={4} />
          <Text color="gray.500" fontSize="lg">
            No hay vehículos reportando ubicaciones en Cartagena
          </Text>
          <Text color="gray.400" fontSize="sm">
            Las ubicaciones aparecerán automáticamente cuando los drivers envíen
            señales
          </Text>
        </Box>
      )}
    </Container>
  );
}

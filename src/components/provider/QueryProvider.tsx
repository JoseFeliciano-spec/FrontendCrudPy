// Archivo: providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configuración del QueryClient optimizada para el sistema de monitoreo IoT
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configuración para datos de sensores IoT que se actualizan frecuentemente
        staleTime: 5 * 60 * 1000, // 5 minutos para datos de vehículos/drivers
        gcTime: 10 * 60 * 1000, // 10 minutos de cache
        retry: 3, // Reintentos para resiliencia en conexiones móviles
        refetchOnWindowFocus: true, // Refrescar al volver a la ventana (importante para dashboard en vivo)
        refetchOnReconnect: true, // Refrescar al reconectar (crítico para funcionalidad offline)
        refetchInterval: 30000, // Auto-refresh cada 30 segundos para datos de ubicación GPS en tiempo real
      },
      mutations: {
        retry: 2, // Reintentos para creación de drivers/vehicles
        onError: (error) => {
          // Manejo global de errores para mutaciones (logs, analytics)
          console.error("Mutation Error:", error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: crear nuevo client
    return makeQueryClient();
  } else {
    // Browser: reutilizar client existente o crear uno nuevo
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // No usar useState para evitar re-creación del client en cada render
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { UserCircle, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUser } from "@/actions/auth/getUser";
import ButtonLogout from "@/components/auth/ButtonLogout";
import CreateDriverVehiclePage from "@/components/driver/Driver";
import dynamic from "next/dynamic";
import LandingPage from "@/components/landing/LandingPage";

const DriversGrid = dynamic(() => import("@/components/driver/DriverGrid"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
      }}
    >
      <p>Cargando conductores...</p>
    </div>
  ),
});

const RealTimeMap = dynamic(() => import("@/components/maps/RealTimeMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
      }}
    >
      <p>Cargando conductores...</p>
    </div>
  ),
});

const DriverLocationSender = dynamic(
  () => import("@/components/driver/DriverLocationSender"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <p>Cargando conductores...</p>
      </div>
    ),
  }
);

export default async function Page() {
  const user = await getUser();
  console.log(user);
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Mapa Movilidad</h1>
        {user?.message === "No se encontró token de autenticación" ? (
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>{user?.data?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col space-y-1">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.data?.email}
                </div>
                <Separator />
                <ButtonLogout />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </header>

      {user?.message === "No se encontró token de autenticación" ? (
        <LandingPage />
      ) : user?.data?.role === "admin" ? (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mt-2">
            <TabsTrigger value="list">Lista conductores</TabsTrigger>
            <TabsTrigger value="vehicles">Nuevos conductores</TabsTrigger>
            <TabsTrigger value="maps">Mapa conductores</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <DriversGrid user={user} />
          </TabsContent>
          <TabsContent value="vehicles">
            <CreateDriverVehiclePage user={user} />
          </TabsContent>
          <TabsContent value="maps">
            <RealTimeMap user={user} />
          </TabsContent>
        </Tabs>
      ) : (
        <DriverLocationSender vehicleId={user?.data?.vehicleId} user={user} />
      )}
    </div>
  );
}

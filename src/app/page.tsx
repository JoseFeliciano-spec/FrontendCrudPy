import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  UserCircle,
  ChevronDown,
  Package,
  ArrowUpDown,
  Bell,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUser } from "@/actions/auth/getUser";
import Home from "@/components/home/Home";
import ButtonLogout from "@/components/auth/ButtonLogout";
import Stock from "@/components/stock/Stock";

export default async function Page() {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">FeliInventory</h1>
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
        <>
          <main className="flex-grow">
            <section className="py-12 md:py-24 lg:py-32 bg-background">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl mb-4">
                  Gestiona tu inventario con FeliInventory
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  La aplicación de control de inventario más intuitiva y
                  eficiente. Simplifica la gestión de tus productos y aumenta tu
                  productividad.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={"/register"}>Regístrate Gratis</Link>
                  </Button>
                </div>
              </div>
            </section>

            <section className="py-12 md:py-24 bg-muted">
              <div className="container mx-auto xl:px-60">
                <h3 className="text-2xl font-bold text-center mb-12">
                  Características Principales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Package,
                      title: "Gestión de Productos",
                      description: "Registra productos con SKU único",
                    },
                    {
                      icon: ArrowUpDown,
                      title: "Movimientos de Inventario",
                      description: "Controla entradas y salidas de stock",
                    },
                    {
                      icon: Bell,
                      title: "Alertas de Stock",
                      description: "Recibe notificaciones de stock bajo",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <feature.icon className="h-12 w-12 mb-4 text-primary" />
                      <h4 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12 md:py-24 bg-primary text-primary-foreground">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  ¿Listo para optimizar tu inventario?
                </h3>
                <p className="mb-8 max-w-2xl mx-auto">
                  Únete a miles de empresas que ya han simplificado su gestión
                  de inventario con FeliInventory.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={"/login"}>Comienza Ahora - ¡Es Gratis!</Link>
                </Button>
              </div>
            </section>
          </main>

          <footer className="p-4 text-center text-sm text-muted-foreground bg-background">
            © {new Date().getFullYear()} FeliInventory. Todos los derechos
            reservados.
          </footer>
        </>
      ) : (
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mt-2">
            <TabsTrigger value="home">Productos</TabsTrigger>
            <TabsTrigger value="stock">Movimientos de stock</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <Home />
          </TabsContent>
          <TabsContent value="stock">
            <Stock />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

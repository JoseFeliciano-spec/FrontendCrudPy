import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, AlertTriangle } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <main className="flex-grow">
        <section className="py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl mb-4">
              Monitorea tu flota vehicular con Mapa Movilidad
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              La plataforma más avanzada para gestión de flotas IoT. Rastrea
              ubicaciones en tiempo real, recibe alertas predictivas y optimiza
              rutas con datos GPS y sensores.
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
                  icon: Truck,
                  title: "Gestión de Vehículos",
                  description:
                    "Registra y monitorea flotas con datos en tiempo real",
                },
                {
                  icon: MapPin,
                  title: "Rastreo GPS",
                  description: "Ubicaciones en vivo y rutas históricas",
                },
                {
                  icon: AlertTriangle,
                  title: "Alertas Predictivas",
                  description: "Notificaciones de bajo combustible o anomalías",
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
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para optimizar tu flota?
            </h3>
            <p className="mb-8 max-w-2xl mx-auto">
              Únete a empresas que ya monitorean sus vehículos de manera
              eficiente con Mapa Movilidad.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href={"/login"}>Comienza Ahora - ¡Es Gratis!</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground bg-background">
        © Mapa Movilidad. Todos los derechos reservados.
      </footer>
    </>
  );
}

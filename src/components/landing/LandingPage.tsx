import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit3, Trash, Sparkles, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <main className="flex-grow">
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-bounce delay-1000"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
              <Sparkles className="w-4 h-4" />
              Gestión de marcas simplificada
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Registros de Marca
              <br />
              <span className="text-4xl md:text-6xl">
                Hecho por Jose Feliciano
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              La plataforma más intuitiva para crear, gestionar y organizar tus
              registros de marca.{" "}
              <span className="font-semibold text-purple-600">
                Simple, rápido y poderoso.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={"/login"}>✨ Explorar ahora</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 hover:bg-slate-50"
              >
                <Link href={"/registrar"}>Registrar</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CARACTERÍSTICAS CRUD - CARDS FLOTANTES */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Todo lo que necesitas
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Herramientas poderosas diseñadas para hacer tu trabajo más
                eficiente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Plus,
                  title: "Crear",
                  description:
                    "Agrega nuevas marcas con nuestro formulario súper rápido",
                  color: "from-green-400 to-emerald-500",
                  bg: "bg-green-50",
                },
                {
                  icon: Eye,
                  title: "Visualizar",
                  description:
                    "Explora todos tus registros con filtros inteligentes",
                  color: "from-blue-400 to-cyan-500",
                  bg: "bg-blue-50",
                },
                {
                  icon: Edit3,
                  title: "Editar",
                  description:
                    "Actualiza información al instante, sin complicaciones",
                  color: "from-amber-400 to-orange-500",
                  bg: "bg-amber-50",
                },
                {
                  icon: Trash,
                  title: "Eliminar",
                  description:
                    "Remueve registros de forma segura cuando lo necesites",
                  color: "from-red-400 to-pink-500",
                  bg: "bg-red-50",
                },
              ].map((feature, index) => (
                <div key={index} className="group cursor-pointer">
                  <div
                    className={`${feature.bg} p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN DE BENEFICIOS */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-bold text-white mb-6">
                  ¿Por qué elegir nuestra plataforma?
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: Zap,
                      title: "Súper rápido",
                      desc: "Interfaz optimizada para máxima velocidad",
                    },
                    {
                      icon: Shield,
                      title: "100% Seguro",
                      desc: "Tus datos están protegidos con la mejor tecnología",
                    },
                    {
                      icon: Sparkles,
                      title: "Intuitivo",
                      desc: "Diseño pensado para que cualquiera pueda usarlo",
                    },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-slate-300">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-3xl">
                  <div className="text-6xl font-bold text-white mb-2">
                    +1000
                  </div>
                  <div className="text-slate-300">
                    Marcas registradas exitosamente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h3>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Únete a cientos de usuarios que ya simplifican su gestión de
              marcas
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-slate-50 text-lg px-8 py-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              asChild
            >
              <Link href={"/brands"}>🚀 Comenzar gratis</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER MODERNO */}
      <footer className="py-8 bg-slate-900 text-center text-slate-400">
        <div className="container mx-auto px-4">
          <p className="mb-2">
            © {new Date().getFullYear()} Registros de Marca
          </p>
          <p className="text-sm">Hecho con ❤️ para simplificar tu trabajo</p>
        </div>
      </footer>
    </>
  );
}

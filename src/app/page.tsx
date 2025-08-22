import { getUser } from "@/actions/auth/getUser";
import dynamic from "next/dynamic";
import LandingPage from "@/components/landing/LandingPage";
import Header from "@/components/header/Header";
import LayoutSideBar from "@/components/header/LayoutSideBar";

const Product = dynamic(() => import("@/components/product/Product"), {
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
      <p>Cargando Productos...</p>
    </div>
  ),
});

export default async function Page() {
  const user = await getUser();
  return (
    <LayoutSideBar user={user}>
      <div className="flex flex-col min-h-[100dvh]">
        {user?.message === "No se encontró token de autenticación" ? (
          <LandingPage />
        ) : (
          <Product user={user} />
        )}
      </div>
    </LayoutSideBar>
  );
}

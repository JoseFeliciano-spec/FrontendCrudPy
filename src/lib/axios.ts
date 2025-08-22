import Axios from "axios";
/* import storage from "@/lib/storage"; */
import Swal from "sweetalert2";

let expired = false;

function hideProgressBar() {
  document.body.classList.remove("loading-indicator");
  const progressBar = document.getElementById("loading-bar");
  progressBar?.classList.add("loading-hide");
}

/* function authRequestInterceptor(config: any) {
  showProgressBar();
  const token = storage.getToken();
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  config.headers = {
    ...config.headers,
    "Access-Control-Allow-Origin": "*",
  };
  return config;
} */

// Si hay mas de un request al tiempo cuando el token expira
// La ventana de alert se abrira para cada uno de esos request que quedaron en el aire
function openAlert(message: string) {
  if (!expired) {
    expired = true;
    Swal.fire({ title: "Oops", icon: "error", text: `Error: ${message}` });
  }
}

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/* axios.interceptors.request.use(authRequestInterceptor); */
axios.interceptors.response.use(
  (response) => {
    hideProgressBar();
    return response.data;
  },
  (error) => {
    if (
      error.response?.status === 400 &&
      error.response?.data?.data === "Caracteres especiales no permitidos"
    ) {
      Swal.fire({
        title: "Error de caracteres especiales",
        text: "Valide que el campo no contenga caracteres especiales",
        icon: "error",
      });
    }
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token inválido o expirado"
    ) {
      openAlert("Su sesión ha expirado");
      /* storage.clearToken(); */
      window.location.reload();
    }
    if (error.response?.data?.message === "La contraseña es incorrecta") {
      Swal.fire({
        title: "Error",
        text: "La contraseña es incorrecta",
        icon: "error",
      });
      hideProgressBar();
    }
    if (
      error.response?.data?.message ===
      "Por favor actualice su contraseña en la opcion, olvidar contraseña"
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor actualice su contraseña en la opcion, olvidar contraseña",
        icon: "error",
      });
      hideProgressBar();
    }
    if (error.response?.data?.message === "Usuario no registrado") {
      Swal.fire({
        title: "Error",
        text: "Usuario no registrado",
        icon: "error",
      });
      hideProgressBar();
    }

    return Promise.reject(error);
  }
);

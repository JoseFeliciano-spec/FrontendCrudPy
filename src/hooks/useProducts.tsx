// hooks/useProducts.ts
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import toast from "react-hot-toast";

export interface Product {
  id: string;
  marca: string;
  titulo: string;
  estado: "activo" | "inactivo" | "borrador";
  owner_id: string;
}

export interface ProductFormData {
  marca: string;
  titulo: string;
  estado: "activo" | "inactivo" | "borrador";
}

export const useProducts = (token: string | null) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [limit] = useState(10);

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: ["products", page, limit, token],
    queryFn: async () => {
      const response = await axios.get(
        `/v1/products?skip=${page * limit}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await axios.post("/v1/products", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Error al crear producto");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductFormData>;
    }) => {
      const response = await axios.put(`/v1/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "Error al actualizar producto"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Error al eliminar producto");
    },
  });

  return {
    products: productsData || [],
    isLoading,
    error,
    page,
    setPage,
    limit,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

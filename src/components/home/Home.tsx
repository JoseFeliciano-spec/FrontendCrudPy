"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Loader2, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/actions/home/crud";
import toast from "react-hot-toast";

const productSchema = yup.object({
  name: yup
    .string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  sku: yup
    .string()
    .required("El SKU es requerido")
    .matches(
      /^[A-Za-z0-9-]+$/,
      "El SKU solo puede contener letras, números y guiones"
    )
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(20, "El SKU no puede exceder 20 caracteres"),
  price: yup
    .number()
    .required("El precio es requerido")
    .min(0, "El precio debe ser mayor o igual a 0")
    .max(1000000, "El precio no puede exceder 1,000,000")
    .test(
      "decimals",
      "El precio no puede tener más de 2 decimales",
      (value) => {
        if (!value) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    ),
  stock: yup
    .number()
    .required("El stock es requerido")
    .integer("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .max(999999, "El stock no puede exceder 999,999"),
});

// Define types based on the schema
export type CrudProductDto = yup.InferType<typeof productSchema> & {
  id?: string;
};

export default function Home() {
  const [products, setProducts] = useState<CrudProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CrudProductDto | null>(
    null
  );

  const form = useForm<CrudProductDto>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      form.reset(editingProduct);
    } else {
      form.reset({
        name: "",
        sku: "",
        price: 0,
        stock: 0,
      });
    }
  }, [editingProduct, form]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProducts();
      if (response.statusCode === 200) {
        setProducts(response?.data);
        toast.success(response?.message);
      } else {
        throw new Error("No se pudieron cargar los productos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CrudProductDto) => {
    try {
      setIsLoading(true);
      if (editingProduct?.id) {
        const response = await updateProduct(editingProduct.id, data);
        if (response.statusCode === 200) {
          toast.success("¡Producto actualizado exitosamente! 🎉");
        } else {
          toast.error(response?.errors);
        }
      } else {
        const response = await createProduct(data);
        if (response.statusCode === 201) {
          toast.success("¡Producto creado exitosamente! 🎉");
        } else {
          console.log(response?.errors);
          toast.error(response?.errors);
        }
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear/actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await deleteProduct(id);
      if (response.statusCode === 200) {
        await loadProducts();
        toast.success("¡Producto eliminado exitosamente!");
      } else {
        throw new Error("No se pudo eliminar el producto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-grow p-4 md:p-6 lg:p-8 bg-background">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Gestión de Productos
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  form.reset({
                    name: "",
                    sku: "",
                    price: 0,
                    stock: 0,
                  });
                }}
                className="w-full transition-all duration-200 hover:scale-105"
              >
                <PlusIcon className="h-4 w-4 mr-2" /> Nuevo Producto
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? "Modifica los detalles del producto"
                    : "Introduce los detalles del nuevo producto"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del producto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Código SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Precio del producto"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Cantidad en stock"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full transition-all duration-200 hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : editingProduct ? (
                      "Actualizar"
                    ) : (
                      "Crear"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <Loader2 className="h-6 w-6 mx-auto animate-spin" />
          ) : products.length === 0 ? (
            <p className="text-center">No hay productos disponibles.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between border p-4 rounded"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Precio: ${product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} unidades
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(product.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

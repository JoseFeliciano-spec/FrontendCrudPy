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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchProducts, CrudProductDto } from "@/actions/home/crud";
import {
  createStockMovement,
  fetchStockMovements,
  deleteStockMovement,
  updateStockMovement,
  StockMovementDto,
} from "@/actions/stock/crud";
import toast from "react-hot-toast";

// Interfaz para el manejo de errores
interface ErrorResponse {
  statusCode?: number;
  errors?: string;
  message?: string;
}

// Schema de validación con Yup
const stockMovementSchema = yup.object({
  productId: yup
    .string()
    .required("Debes seleccionar un producto")
    .matches(/^[0-9a-fA-F-]+$/, "ID de producto inválido"),
  type: yup
    .string()
    .required("Debes seleccionar un tipo de movimiento")
    .oneOf(["entrada", "salida"], "Tipo de movimiento inválido"),
  quantity: yup
    .number()
    .required("La cantidad es requerida")
    .integer("La cantidad debe ser un número entero")
    .min(1, "La cantidad debe ser mayor a 0")
    .max(99999, "La cantidad no puede exceder 99,999 unidades")
    .test("is-number", "Debe ser un número válido", (value) => !isNaN(value)),
});

// Tipo basado en el schema
type StockMovementFormData = yup.InferType<typeof stockMovementSchema>;

export default function Stock() {
  const [products, setProducts] = useState<CrudProductDto[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovementDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [editingMovement, setEditingMovement] =
    useState<StockMovementDto | null>(null);

  // Inicialización del formulario con Yup
  const movementForm = useForm<StockMovementFormData>({
    resolver: yupResolver(stockMovementSchema),
    defaultValues: {
      productId: "",
      type: "entrada",
      quantity: 0,
    },
  });

  const handleError = (error: any) => {
    const errorResponse = error?.errors;
    if (errorResponse) {
      toast.error(errorResponse);
      console.error("Error details:", errorResponse);
    } else {
      toast.error("Ha ocurrido un error inesperado");
      console.error("Unknown error:", error);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadProducts(), loadStockMovements()]);
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProducts();
      if (response.statusCode === 200) {
        setProducts(response.data);
        return true;
      }
      throw response;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadStockMovements = async () => {
    try {
      setIsLoading(true);
      const response = await fetchStockMovements();
      if (response.statusCode === 200) {
        setStockMovements(response.data);
        return true;
      }
      throw response;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovementSubmit = async (data: StockMovementFormData) => {
    try {
      setIsLoading(true);
      const movementData = {
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
      };

      let response;
      if (editingMovement?.id) {
        response = await updateStockMovement(
          editingMovement.id,
          movementData as any
        );
        if (response.statusCode === 200) {
          toast.success("Movimiento actualizado exitosamente");
        } else {
          throw response;
        }
      } else {
        response = await createStockMovement(movementData as any);
        if (response.statusCode === 201) {
          toast.success("Movimiento creado exitosamente");
        } else {
          throw response;
        }
      }

      handleCloseDialog();
      await refreshData();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMovement = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await deleteStockMovement(id);
      if (response.statusCode === 200) {
        toast.success("Movimiento eliminado exitosamente");
        await refreshData();
      } else {
        throw response;
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMovement = (movement: StockMovementDto) => {
    setEditingMovement(movement);
    movementForm.reset({
      productId: movement.productId,
      type: movement.type,
      quantity: movement.quantity,
    });
    setIsMovementDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsMovementDialogOpen(false);
    setEditingMovement(null);
    movementForm.reset({
      productId: "",
      type: "entrada",
      quantity: 0,
    });
    movementForm.clearErrors();
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderMovementItem = (movement: StockMovementDto) => (
    <div key={movement.id} className="border p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">
            {products.find((p) => p.id === movement.productId)?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {movement.type.toUpperCase()} - {movement.quantity} unidades
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditMovement(movement)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteMovement(movement.id!)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8 max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold mb-4">Movimientos de Stock</h3>

      <Dialog
        open={isMovementDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          else setIsMovementDialogOpen(true);
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => setIsMovementDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Movimiento
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMovement ? "Editar" : "Nuevo"} Movimiento
            </DialogTitle>
          </DialogHeader>

          <Form {...movementForm}>
            <form
              onSubmit={movementForm.handleSubmit(handleMovementSubmit)}
              className="space-y-4"
            >
              <FormField
                control={movementForm.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id!}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={movementForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="salida">Salida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={movementForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Guardar"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="mt-4 space-y-4">
        {stockMovements.map(renderMovementItem)}
      </div>
    </div>
  );
}

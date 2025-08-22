// components/ProductsManager.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Grid3X3,
  Table,
  Package,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useProducts, Product, ProductFormData } from "@/hooks/useProducts";
import ProductStepsForm from "./ProductStepsForm";

interface ProductsManagerProps {
  user: any;
}

type ViewMode = "table" | "cards" | "form";

export default function ProductsManager({ user }: ProductsManagerProps) {
  const token = user?.data?.token;
  const {
    products,
    isLoading,
    page,
    setPage,
    limit,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProducts(token);

  // Estado para el modo de vista con persistencia en localStorage
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Estados para el modo formulario inline
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [inlineEditingProduct, setInlineEditingProduct] =
    useState<Product | null>(null);

  // Cargar modo de vista desde localStorage al montar
  useEffect(() => {
    const savedViewMode = localStorage.getItem(
      "products-view-mode"
    ) as ViewMode;
    if (
      savedViewMode &&
      (savedViewMode === "table" ||
        savedViewMode === "cards" ||
        savedViewMode === "form")
    ) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Función para cambiar modo de vista y guardarlo
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("products-view-mode", mode);

    // Si cambiamos a modo form y hay formulario inline abierto, lo cerramos
    if (mode !== "form") {
      setShowInlineForm(false);
      setInlineEditingProduct(null);
    }
  };

  const handleCreate = (data: ProductFormData) => {
    createProduct(data);
    if (viewMode === "form") {
      setShowInlineForm(false);
    } else {
      setCreateModalOpen(false);
    }
  };

  const handleUpdate = (data: ProductFormData) => {
    if (viewMode === "form" && inlineEditingProduct) {
      updateProduct({ id: inlineEditingProduct.id, data });
      setInlineEditingProduct(null);
      setShowInlineForm(false);
    } else if (editingProduct) {
      updateProduct({ id: editingProduct.id, data });
      setEditingProduct(null);
      setEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  const openEditModal = (product: Product) => {
    if (viewMode === "form") {
      setInlineEditingProduct(product);
      setShowInlineForm(true);
    } else {
      setEditingProduct(product);
      setEditModalOpen(true);
    }
  };

  const handleNewProduct = () => {
    if (viewMode === "form") {
      setInlineEditingProduct(null);
      setShowInlineForm(true);
    } else {
      setCreateModalOpen(true);
    }
  };

  const handleCancelInlineForm = () => {
    setShowInlineForm(false);
    setInlineEditingProduct(null);
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activo: "bg-green-100 text-green-800 border-green-200",
      inactivo: "bg-red-100 text-red-800 border-red-200",
      borrador: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          colors[estado as keyof typeof colors] ||
          "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  // Componente Card para vista de tarjetas
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {product.marca}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.titulo}
          </p>
          <div className="flex justify-start">
            {getEstadoBadge(product.estado)}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => openEditModal(product)}
          disabled={isUpdating}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Actualizar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={() => setDeletingProduct(product)}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar "{product.marca} -{" "}
                {product.titulo}"? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Si estamos en modo form y mostrando el formulario inline
  if (viewMode === "form" && showInlineForm) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col">
        {/* Header para formulario inline */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancelInlineForm}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {inlineEditingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h1>
              <p className="text-gray-600">
                {inlineEditingProduct
                  ? `Editando: ${inlineEditingProduct.marca} - ${inlineEditingProduct.titulo}`
                  : "Completa los datos para crear un nuevo producto"}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario inline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <ProductStepsForm
              onSubmit={handleUpdate}
              isLoading={inlineEditingProduct ? isUpdating : isCreating}
              onCancel={handleCancelInlineForm}
              initialData={
                inlineEditingProduct
                  ? {
                      marca: inlineEditingProduct.marca,
                      titulo: inlineEditingProduct.titulo,
                      estado: inlineEditingProduct.estado,
                    }
                  : undefined
              }
              isEdit={!!inlineEditingProduct}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header con toda la pantalla */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Servicios/Registro de Marca
            </h1>
            <p className="text-gray-600">
              Administra marca, título y estado de tus productos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle de vista con 3 opciones */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange("table")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Table className="w-4 h-4 mr-2" />
                Tabla
              </button>
              <button
                onClick={() => handleViewModeChange("cards")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Cards
              </button>
              <button
                onClick={() => handleViewModeChange("form")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "form"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Formulario
              </button>
            </div>

            {/* Botón Nuevo Registro */}
            <button
              onClick={handleNewProduct}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Registro
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal que ocupa el resto de la pantalla */}
      <div className="flex-1 overflow-hidden p-6">
        {products.length === 0 ? (
          // Estado vacío
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos registrados
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza creando tu primer registro de marca para empezar a
                gestionar tus productos.
              </p>
              <button
                onClick={handleNewProduct}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear tu primer producto
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Vista de Form (lista de productos para editar) */}
            {viewMode === "form" ? (
              <div className="flex-1 overflow-y-auto">
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Productos Existentes
                  </h3>
                  <div className="space-y-3">
                    {products.map((product: Product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              {product.marca}
                            </h4>
                            <span className="text-gray-500">-</span>
                            <p className="text-sm text-gray-600 truncate max-w-xs">
                              {product.titulo}
                            </p>
                            <div className="ml-auto">
                              {getEstadoBadge(product.estado)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            disabled={isUpdating}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Editar
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={() => setDeletingProduct(product)}
                                disabled={isDeleting}
                                className="inline-flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Eliminar
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Eliminar Producto
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que deseas eliminar "
                                  {product.marca} - {product.titulo}"? Esta
                                  acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  ) : null}
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Vista de Cards y Tabla (código existente)
              <>
                {viewMode === "cards" ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                      {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Vista de Tabla */
                  <div className="flex-1 overflow-hidden">
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                Marca
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                Título
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                Estado
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product: Product) => (
                              <tr
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.marca}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 max-w-xs truncate">
                                    {product.titulo}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {getEstadoBadge(product.estado)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => openEditModal(product)}
                                      disabled={isUpdating}
                                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Actualizar"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <button
                                          onClick={() =>
                                            setDeletingProduct(product)
                                          }
                                          disabled={isDeleting}
                                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          title="Eliminar"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Eliminar Producto
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            ¿Estás seguro de que deseas eliminar
                                            "{product.marca} - {product.titulo}
                                            "? Esta acción no se puede deshacer.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {isDeleting ? (
                                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : null}
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paginación fija en la parte inferior */}
                {products.length > 0 && (
                  <div className="mt-6 bg-white px-6 py-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Mostrando {page * limit + 1} -{" "}
                        {Math.min((page + 1) * limit, products.length)}{" "}
                        productos
                      </p>
                      <div className="flex space-x-2">
                        <button
                          disabled={page === 0}
                          onClick={() => setPage(page - 1)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Anterior
                        </button>
                        <button
                          disabled={products.length < limit}
                          onClick={() => setPage(page + 1)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Siguiente
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de Creación (solo para modos table y cards) */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProductStepsForm
            onSubmit={handleCreate}
            isLoading={isCreating}
            onCancel={() => setCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edición (solo para modos table y cards) */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingProduct && (
            <ProductStepsForm
              onSubmit={handleUpdate}
              isLoading={isUpdating}
              onCancel={() => {
                setEditingProduct(null);
                setEditModalOpen(false);
              }}
              initialData={{
                marca: editingProduct.marca,
                titulo: editingProduct.titulo,
                estado: editingProduct.estado,
              }}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

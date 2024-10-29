"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "@/actions/home/crud";
import toast from "react-hot-toast";

export enum TaskStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
}

export interface CrudTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string; // Añadir el campo dueDate
  userId?: string;
  id?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<CrudTaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CrudTaskDto | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const form = useForm<CrudTaskDto>({
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.Pending,
      dueDate: "", // Inicializar dueDate
    },
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (editingTask) {
      form.reset(editingTask);
    } else {
      form.reset({
        title: "",
        description: "",
        status: TaskStatus.Pending,
        dueDate: "", // Resetear dueDate al crear una nueva tarea
      });
    }
  }, [editingTask, form]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTasks();
      if (response.statusCode === 200) {
        setTodos(response?.data);
        toast.success("Tareas cargadas correctamente");
      } else {
        throw new Error("No se pudieron cargar las tareas");
      }
    } catch (error) {
      console.error(error);

      toast.error("Error al cargar las tareas");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleSubmit = async (data: CrudTaskDto) => {
    try {
      setIsLoading(true);
      if (editingTask?.id) {
        const response = await updateTask(editingTask.id, data);
        if (response.statusCode === 200) {
          toast.success("¡Tarea actualizada exitosamente! 🎉");
        } else {
          throw new Error("No se pudo actualizar la tarea");
        }
      } else {
        const response = await createTask(data);
        if (response.statusCode === 201) {
          toast.success("¡Tarea creada exitosamente! 🎉");
        } else {
          throw new Error("No se pudo crear la tarea");
        }
      }
      setIsDialogOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error(error);

      toast.error("Error al crear/actualizar la tarea");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await deleteTask(id);
      if (response.statusCode === 200) {
        await loadTasks();
        toast.success("¡Tarea eliminada exitosamente!");
      } else {
        throw new Error("No se pudo eliminar la tarea");
      }
    } catch (error) {
      console.error(error);

      toast.error("Error al eliminar la tarea");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleStatusChange = async (
    task: CrudTaskDto,
    newStatus: TaskStatus
  ) => {
    if (!task.id) return;
    try {
      setIsLoading(true);
      const response = await updateTask(task.id, { status: newStatus });
      if (response.statusCode === 200) {
        await loadTasks();
      } else {
        throw new Error("No se pudo actualizar el estado");
      }
    } catch (error) {
      console.error(error);

      toast.error("Error al actualizar el estado de la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    return statusFilter === "all" ? true : todo.status === statusFilter;
  });

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-grow p-4 md:p-6 lg:p-8 bg-background">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Mi Lista de Tareas
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full transition-all duration-200 hover:scale-105">
                <PlusIcon className="h-4 w-4 mr-2" /> Nueva Tarea
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Editar Tarea" : "Crear Nueva Tarea"}
                </DialogTitle>
                <DialogDescription>
                  {editingTask
                    ? "Modifica los detalles de la tarea"
                    : "Introduce los detalles de la nueva tarea"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "El título es requerido" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título de la tarea" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Descripción de la tarea"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate" // Nuevo campo para la fecha
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Vencimiento</FormLabel>
                        <FormControl>
                          <Input
                            type="date" // Tipo de entrada para fecha
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="in-progress">
                              En Progreso
                            </SelectItem>
                            <SelectItem value="completed">
                              Completada
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                    ) : editingTask ? (
                      "Actualizar"
                    ) : (
                      "Crear"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Selector de filtro de estado */}
          <Select
            onValueChange={(value) =>
              setStatusFilter(value as TaskStatus | "all")
            }
            defaultValue={statusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="mb-4">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="in-progress">En Progreso</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
            </SelectContent>
          </Select>

          {isLoading ? (
            <Loader2 className="h-6 w-6 mx-auto animate-spin" />
          ) : filteredTodos.length === 0 ? (
            <p className="text-center">No hay tareas disponibles.</p>
          ) : (
            <ul className="space-y-4">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between border p-4 rounded"
                >
                  <div className="flex items-center">
                    <Checkbox
                      checked={todo.status === TaskStatus.Completed}
                      onCheckedChange={() =>
                        handleStatusChange(
                          todo,
                          todo.status === TaskStatus.Completed
                            ? TaskStatus.Pending
                            : TaskStatus.Completed
                        )
                      }
                    />
                    <div className="ml-2">
                      <h3
                        className={
                          todo.status === TaskStatus.Completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {todo.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {todo.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fecha de Vencimiento: {todo.dueDate || "No establecida"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingTask(todo);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(todo.id!)}
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

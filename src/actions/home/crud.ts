"use server";
import { cookies } from "next/headers";
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface CrudTasKDto {
  title: string;
  description: string;
  status: TaskStatus;
  userId?: string;
  id?: string;
}

const API_URL = process.env.API_URL;

// Función para obtener las tareas
export async function fetchTasks() {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/tasks`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

// Función para crear una tarea
export async function createTask(task: CrudTasKDto) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/tasks`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();
  return data;
}

// Función para actualizar una tarea
export async function updateTask(
  taskId: string,
  updatedTask: Partial<CrudTasKDto>
) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/tasks/${taskId}`, {
    method: "PUT",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });

  const data = await response.json();
  return data;
}

// Función para eliminar una tarea
export async function deleteTask(taskId: string) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/tasks/${taskId}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

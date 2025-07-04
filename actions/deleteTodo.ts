'use server'

import { HOST } from "@/constant/env";
import { revalidateTag } from "next/cache";

export type DeleteTodoActionState = { success: boolean }

export default async function deleteTodo(_: DeleteTodoActionState, queryData: FormData): Promise<DeleteTodoActionState> {
  const id = queryData.get('id');
  const response = await fetch(`${HOST}/api/todos/${id}`, { method: 'DELETE' });
  const data = await response.json();

  if (!data) {
    return { success: false }
  }

  revalidateTag('todos');

  return data;
}
'use server'
import { HOST } from "@/constant/env";
import { todoSchema } from "@/lib/validation/todoSchema";
import { revalidateTag } from "next/cache";

type UpdateTodoActionState = {
  success: boolean;
  todo?: TodoWithId;
  errors?: {
    title?: string[],
    description?: string[],
    status?: string[]
  }
}

export default async function updateTodo(
  _prevState: UpdateTodoActionState,
  queryData: FormData,
): Promise<UpdateTodoActionState> {
  const idValue = queryData.get('id');
  const updateTodo: TodoWithId = {
    id: idValue !== null ? Number(idValue) : 0,
    title: queryData.get('title') as string,
    description: queryData.get('description') as string,
    status: queryData.get('status') as 'ready' | 'in-progress' | 'completed' || 'ready',
  };
  const validated = todoSchema.safeParse(updateTodo);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const response = await fetch(`${HOST}/api/todos/${idValue}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateTodo),
  });
  const updatedTodo = await response.json() as TodoWithId;

  if (!response.ok) {
    return { success: false, errors: { title: ['Failed to update todo'] } };
  }

  revalidateTag('todos');

  return { success: true, todo: updatedTodo };
}
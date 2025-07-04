'use server'
import { todoSchema } from "@/lib/validation/todoSchema";
import { revalidateTag } from "next/cache";
import { HOST } from "@/constant/env";

type CreateTodoActionState = {
  success: boolean;
  todo?: TodoWithId;
  errors?: {
    title?: string[],
    description?: string[],
    status?: string[]
  }
}

export default async function createTodo(
  _prevState: CreateTodoActionState,
  queryData: FormData,
): Promise<CreateTodoActionState> {
  const newTodo: Todo = {
    title: queryData.get('title') as string || '',
    description: queryData.get('description') as string || '',
    status: 'ready'
  };
  const validated = todoSchema.safeParse(newTodo);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const response = await fetch(`${HOST}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  });
  const createdTodo = await response.json() as TodoWithId;
  revalidateTag('todos');

  return { success: true, todo: { id: createdTodo.id, title: createdTodo.title, description: createdTodo.description, status: createdTodo.status } };
}
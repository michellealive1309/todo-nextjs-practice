import TodoList from "@/components/TodoList";
import { HOST } from "@/constant/env";
import { QUERY } from "@/constant/query";

export default async function Home() {
  const data = await fetch(`${HOST}/api/todos?page${1}?size=${QUERY.Size}`, { next: { tags: ["todos"] } });
  const todos: TodoWithId[] = await data.json() || [];

  return (
    <>
      <div className="flex flex-col items-center min-h-screen py-6 bg-gray-100 dark:bg-gray-900">
        <div className="xl:w-xl lg:w-lg md:w-md sm:w-sm">
          <TodoList todos={todos} />
        </div>
      </div>
    </>
  );
}

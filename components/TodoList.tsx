'use client'
import { useCallback, useState } from "react";
import { QUERY } from "@/constant/query";
import TodoCard from "./TodoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { HOST } from "@/constant/env";
import toast from "react-hot-toast";
import TodoForm from "./TodoForm";
import { set } from "zod/v4";

export default function TodoList({todos}: { todos: TodoWithId[] }) {
  const maxPage = 5;
  const [ nextPage, setNextPage ] = useState<number>(2);
  const [ hasMore, setHasMore ] = useState<boolean>(todos.length >= QUERY.Size);
  const [ todoList, setTodoList ] = useState<TodoWithId[]>(todos);
  const onCreated = useCallback((newTodo: TodoWithId) => {
    setTodoList((prevTodoList) => [newTodo, ...prevTodoList]);
  }, []);
  const onDeleted = useCallback((deletedTodoId: number) => {
    setTodoList((prevTodoList) => prevTodoList.filter(todo => todo.id !== deletedTodoId));
    toast.success(`Todo deleted successfully`);
  }, []);
  const fetchMoreTodos = async () => {
    const response = await fetch(`${HOST}/api/todos?page=${nextPage}?size=${QUERY.Size}`, { next: { tags: ["todos"] } });
    const newTodos = await response.json() as TodoWithId[];

    if (!newTodos || newTodos.length < 1 || nextPage > maxPage) {
      setHasMore(false);
    }
    
    setTodoList((prevTodoList) => [...prevTodoList, ...newTodos]);
    setNextPage((prevNextPage) => prevNextPage + 1);
  };

  return (
    <>
      <TodoForm onSuccess={onCreated}/>
      <InfiniteScroll
        dataLength={todoList.length}
        next={fetchMoreTodos}
        hasMore={hasMore}
        loader={<div className="text-center py-5">Loading...</div>}
        endMessage={ nextPage > 2 ? <div className="text-center py-5">You have reached maximum page</div> : ''}
      >
        {
          !todoList || todoList.length === 0 ? <div className="py-5 text-lg text-center">Nothing to do. Make one.</div> :
            todoList.map((todo) => (
              <TodoCard key={todo.id} todo={todo} onDeleted={onDeleted} />
            ))
        }
      </InfiniteScroll>
    </>
  )
}
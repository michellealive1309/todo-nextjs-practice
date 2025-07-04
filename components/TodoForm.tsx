'use client'
import React, { useState, useRef, useEffect, useActionState } from 'react';
import createTodo from '@/actions/createTodo';
import updateTodo from '@/actions/updateTodo';
import toast from 'react-hot-toast';

export default function TodoForm({ todo, onSuccess }: { todo?: TodoWithId, onSuccess?: (todo: TodoWithId) => void }) {
  const isEdit = !!todo;
  const [isExpanded, setExpand] = useState(isEdit);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const saveToto = isEdit ? updateTodo : createTodo
  const [todoState, saveTodoAction, isPending] = useActionState(saveToto, { success: false });

  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (isEdit && todoState.success) {
      toast.success('Todo updated successfully');
      if (todoState.todo) onSuccess?.(todoState.todo);
    } else if (!isEdit && todoState.success) {
      toast.success('Todo created successfully');
      if (todoState.todo) onSuccess?.(todoState.todo);
      setExpand(!isExpanded);
    }
  }, [todoState]);

  return (
    <>
      {!isExpanded ? (
        <div onClick={() => setExpand(!isExpanded)} className='w-full h-9 mb-2.5 rounded-lg bg-blue-500 content-center text-center transition-transform'>+ Add todo</div>
      ) : (
        <form action={saveTodoAction} className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 relative'>
          <button type='button' className={`w-5 h-5 text-sm rounded-full m-2 bg-gray-500 absolute right-0 top-0 ${isEdit && 'hidden'}`} onClick={() => setExpand(!isExpanded)}>
            X
          </button>
          <div>
            <span className='text-gray-500'>Title</span>
            <input
              ref={titleInputRef}
              type="text"
              name='title'
              className='w-full h-9 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter todo title'
              disabled={isPending}
              defaultValue={todo?.title || ''}
            />
            {
              todoState.errors?.title && (
                <div className='text-red-500 text-sm mt-1'>
                  {todoState.errors.title.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )
            }
          </div>
          <div className='mt-2'>
            <span className='text-gray-500'>Description</span>
            <textarea
              name='description'
              className='w-full h-24 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter todo description'
              disabled={isPending}
              defaultValue={todo?.description || ''}
            ></textarea>
            {
              todoState.errors?.description && (
                <div className='text-red-500 text-sm mt-1'>
                  {todoState.errors.description.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )
            }
          </div>
          {
            todo ? (<div className='my-2'>
              <span className='text-gray-500'>Status</span>
              <select
                name='status'
                className='w-full h-9 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                disabled={isPending}
                defaultValue={todo.status}
              >
                <option value='ready'>Ready</option>
                <option value='in-progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>) : ''
          }
          <input type='hidden' name='id' value={todo?.id}/>
          <button type='submit' className='w-full h-9 rounded-lg bg-blue-500 text-white mt-2' disabled={isPending}>
            {!todo ? 'Add Todo' : 'Update Todo'}
          </button>
        </form>
      )}
    </>
  );
}
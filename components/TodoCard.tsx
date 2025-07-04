'use client';
import React, { useState } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import ConfirmForm from './DeleteConfirmForm';

export default function TodoCard({ todo, onDeleted }: { todo: TodoWithId, onDeleted: (deletedTodoId: number) => void }) {
  const [ todoData, setTodoData ] = useState<TodoWithId>(todo);
  const [ isEditing, setIsEditing ] = React.useState(false);
  const [ isDeleting, setIsDeleting ] = React.useState(false);
  const onEditted = (updatedTodo: TodoWithId) => { setTodoData(updatedTodo); setIsEditing(false); };
  let statusColor: string = '';
  switch (todoData.status) {
    case 'completed':
      statusColor = 'text-green-800';
      break;
    case 'in-progress':
      statusColor = 'text-yellow-800';
      break;
    case 'ready':
      statusColor = 'text-blue-800';
      break;
    default:
      statusColor = 'hidden';
      break;
  }

  return (
    <>
      <div className="w-full py-1.5">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">{todoData.title ?? ''}</h2>
          <p className="text-gray-700 dark:text-gray-300 hyphens-auto wrap-anywhere line-clamp-3">{todoData.description ?? ''}</p>
          <div className="mt-4 flex justify-end *:ml-2.5 *:transition *:delay-150">
            <span className={'justify-start content-center ' + statusColor}>
              {typeof todoData.status === 'string' ? todoData.status.toUpperCase() : ''}
            </span>
            <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
            <button onClick={() => setIsDeleting(!isDeleting)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div>
        </div>
      </div>
      {
        isEditing && (
          <Modal title="Edit Todo" onClose={() => setIsEditing(!isEditing)}>
            <TodoForm todo={todoData} onSuccess={onEditted} />
          </Modal>
        )
      }
      {
        isDeleting && (
          <Modal title="Delete Todo" onClose={() => setIsDeleting(!isDeleting)}>
            <ConfirmForm 
              content={<p>Are you sure you want to delete todo {todoData.title}?</p>}
              id={todoData.id}
              onConfirm={onDeleted}
              onCancel={() => setIsDeleting(!isDeleting)}
            />
          </Modal>
        )
      }
    </>
  );
}

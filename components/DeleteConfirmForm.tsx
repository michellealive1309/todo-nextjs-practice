'use client'
import deleteTodo, { DeleteTodoActionState } from "@/actions/deleteTodo";
import { JSX, useActionState, useEffect } from "react";

export default function DeleteConfirmForm({ content, id, onConfirm, onCancel }: { content: JSX.Element, id: number, onConfirm: (id: number) => void, onCancel: () => void }) {
  const [state, stateAction] = useActionState(deleteTodo, { success: false });

  useEffect(() => {
    if (state.success) {
      onConfirm?.(id);
    }
  }, [state])

  return (
    <form action={stateAction}>
      <h2>
        {content}
      </h2>
      <input type="hidden" name='id' defaultValue={id} />
      <div className="flex p-2 justify-end *:px-4 *:py-2 *:ml-2.5">
        <button type="submit" className="bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
        <button type="button" className="bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
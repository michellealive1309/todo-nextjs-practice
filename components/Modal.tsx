'use client'
import React from "react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {

  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center bg-gray-800/50">
      <div className="bg-white dark:bg-gray-800 relative w-full max-w-md shadow-lg rounded-lg overflow-hidden">
        <button
          className="text-center absolute font-bold top-3 right-3 z-[1]"
          onClick={() => onClose()}
        >
          X
        </button>
        <div className="text-xl font-semibold p-2 overflow-hidden sticky top-0 text-sky-900 dark:text-sky-900 bg-white dark:bg-gray-400">
          {title}
        </div>
        <div className="bg-white dark:bg-gray-800 w-full">{children}</div>
      </div>
    </div>
  );
}
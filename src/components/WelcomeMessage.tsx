import React from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onCreateList: () => void;
}

export default function WelcomeMessage({ onCreateList }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 mb-6">
        <Plus size={32} className="text-white" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Taskable!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Get started by creating a new list or select an existing one from the sidebar.
      </p>
      <button
        onClick={onCreateList}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
      >
        <Plus size={20} />
        Create New List
      </button>
    </div>
  );
}
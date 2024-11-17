import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Menu } from 'lucide-react';
import { TodoItem as TodoItemType } from './types/todo';
import TodoList from './components/TodoList';
import EmptyState from './components/EmptyState';
import ListTitle from './components/ListTitle';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import SignInPrompt from './components/SignInPrompt';
import WelcomeMessage from './components/WelcomeMessage';
import { useTodoSync } from './hooks/useTodoSync';
import { useSettings } from './hooks/useSettings';
import { useUser } from '@clerk/clerk-react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isSignedIn } = useUser();
  const { isDark } = useSettings();
  
  const { 
    lists, 
    setLists,
    error,
    syncWithServer,
    loadFromServer,
    uploadToServer
  } = useTodoSync();

  const [activeListId, setActiveListId] = useState(lists[0]?.id || '');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const activeList = lists.find(list => list.id === activeListId);
  const todos = activeList?.todos || [];

  const createTodo = useCallback(() => {
    if (!activeList) return;

    const newTodo: TodoItemType = {
      id: uuidv4(),
      title: '',
      completed: false,
      level: 0,
      isEmpty: true
    };

    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: [...list.todos, newTodo]
        };
      }
      return list;
    }));
  }, [activeList, activeListId, lists, setLists]);

  const updateTodo = useCallback((id: string, updates: Partial<TodoItemType>) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: list.todos.map(todo => 
            todo.id === id ? { ...todo, ...updates } : todo
          )
        };
      }
      return list;
    }));
  }, [activeListId, lists, setLists]);

  const deleteTodo = useCallback((id: string) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: list.todos.filter(todo => todo.id !== id)
        };
      }
      return list;
    }));
  }, [activeListId, lists, setLists]);

  const duplicateTodo = useCallback((id: string) => {
    const todoToDuplicate = todos.find(todo => todo.id === id);
    if (!todoToDuplicate) return;

    const newTodo: TodoItemType = {
      ...todoToDuplicate,
      id: uuidv4(),
      title: `${todoToDuplicate.title} (copy)`,
      isEmpty: false
    };

    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: [...list.todos, newTodo]
        };
      }
      return list;
    }));
  }, [activeListId, lists, setLists, todos]);

  const indentTodo = useCallback((id: string) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: list.todos.map(todo => 
            todo.id === id ? { ...todo, level: Math.min(todo.level + 1, 3) } : todo
          )
        };
      }
      return list;
    }));
  }, [activeListId, lists, setLists]);

  const outdentTodo = useCallback((id: string) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: list.todos.map(todo => 
            todo.id === id ? { ...todo, level: Math.max(todo.level - 1, 0) } : todo
          )
        };
      }
      return list;
    }));
  }, [activeListId, lists, setLists]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (!activeList) return;

    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      createTodo();
    } else if (e.key === 'Backspace' && todos[todoIndex].title === '') {
      e.preventDefault();
      deleteTodo(id);
    }
  }, [activeList, todos, createTodo, deleteTodo]);

  const handleReorderTodos = useCallback((newTodos: TodoItemType[]) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          todos: newTodos
        };
      }
      return list;
    }));
  }, [activeListId, lists, setLists]);

  const createList = useCallback(() => {
    const newList = {
      id: uuidv4(),
      name: 'Untitled List',
      todos: []
    };
    setLists([...lists, newList]);
    setActiveListId(newList.id);
  }, [lists, setLists]);

  const deleteList = useCallback((id: string) => {
    const newLists = lists.filter(list => list.id !== id);
    setLists(newLists);
    if (activeListId === id) {
      setActiveListId(newLists[0]?.id || '');
    }
  }, [activeListId, lists, setLists]);

  const updateListTitle = useCallback((newTitle: string) => {
    setLists(lists.map(list => 
      list.id === activeListId ? { ...list, name: newTitle } : list
    ));
  }, [activeListId, lists, setLists]);

  if (!isSignedIn) {
    return <SignInPrompt />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onCreateList={createList}
        onDeleteList={deleteList}
      />

      <main className={`pt-24 pb-16 px-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-3xl mx-auto">
          {!activeList && lists.length > 0 ? (
            <WelcomeMessage onCreateList={createList} />
          ) : activeList ? (
            <>
              <ListTitle
                title={activeList.name}
                onUpdateTitle={updateListTitle}
              />
              
              {todos.length === 0 ? (
                <EmptyState onCreateTodo={createTodo} />
              ) : (
                <TodoList
                  todos={todos}
                  onReorder={handleReorderTodos}
                  onUpdate={updateTodo}
                  onKeyDown={handleKeyDown}
                  onDelete={deleteTodo}
                  onDuplicate={duplicateTodo}
                  onIndent={indentTodo}
                  onOutdent={outdentTodo}
                />
              )}
            </>
          ) : (
            <WelcomeMessage onCreateList={createList} />
          )}
        </div>
      </main>

      <Settings />
    </div>
  );
}
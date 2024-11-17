import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { TodoItem } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';

export interface TodoList {
  id: string;
  name: string;
  todos: TodoItem[];
}

const DEFAULT_LIST = {
  id: uuidv4(),
  name: 'My Tasks',
  todos: []
};

export function useTodoSync() {
  const { isSignedIn, user } = useUser();
  const [localLists, setLocalLists] = useLocalStorage<TodoList[]>('todoLists', [DEFAULT_LIST]);
  const [lists, setLists] = useState<TodoList[]>(localLists);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const autoSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStateRef = useRef<TodoList[]>(localLists);
  const lastSyncedStateRef = useRef<string>(JSON.stringify(localLists));

  const parseTodos = (todos: any): TodoItem[] => {
    if (!todos) return [];
    if (typeof todos === 'string') {
      try {
        return JSON.parse(todos);
      } catch {
        return [];
      }
    }
    if (Array.isArray(todos)) {
      return todos.map(todo => ({
        ...todo,
        id: todo.id || uuidv4(),
      }));
    }
    return [];
  };

  const fetchLists = useCallback(async () => {
    if (!isSignedIn || !user) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('todo_lists')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (data) {
        return data.map(list => ({
          id: list.id,
          name: list.name,
          todos: parseTodos(list.todos),
        }));
      }
      return null;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  }, [isSignedIn, user]);

  const loadFromServer = useCallback(async () => {
    if (!isSignedIn || !user) return;

    try {
      const serverLists = await fetchLists();
      
      if (serverLists && serverLists.length > 0) {
        // Keep server data as it's the source of truth when loading
        setLists(serverLists);
        setLocalLists(serverLists);
        currentStateRef.current = serverLists;
        lastSyncedStateRef.current = JSON.stringify(serverLists);
      } else if (!initialized) {
        // If no server data and not initialized, upload local data
        const listsToUpload = localLists.length > 0 ? localLists : [DEFAULT_LIST];
        await uploadToServer(listsToUpload);
        setLists(listsToUpload);
        currentStateRef.current = listsToUpload;
      }
    } catch (err) {
      console.error('Error loading lists:', err);
      setError(err instanceof Error ? err.message : 'Error loading lists');
      // Fall back to local data if server load fails
      setLists(localLists);
      currentStateRef.current = localLists;
    } finally {
      setInitialized(true);
    }
  }, [fetchLists, isSignedIn, user, localLists, initialized]);

  const uploadToServer = useCallback(async (listsToUpload: TodoList[]) => {
    if (!isSignedIn || !user || isSyncing) return;

    const currentStateString = JSON.stringify(listsToUpload);
    if (currentStateString === lastSyncedStateRef.current) {
      return; // No changes to sync
    }

    try {
      setIsSyncing(true);
      
      // Delete all existing lists first to handle removals
      await supabase
        .from('todo_lists')
        .delete()
        .eq('user_id', user.id);

      // Then insert all current lists
      for (const list of listsToUpload) {
        const { error: insertError } = await supabase
          .from('todo_lists')
          .insert({
            id: list.id,
            name: list.name,
            todos: JSON.stringify(list.todos),
            user_id: user.id,
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      lastSyncedStateRef.current = currentStateString;
    } catch (err) {
      console.error('Error uploading to server:', err);
      setError(err instanceof Error ? err.message : 'Error uploading data');
    } finally {
      setIsSyncing(false);
    }
  }, [isSignedIn, user, isSyncing]);

  const updateLists = useCallback((newLists: TodoList[]) => {
    setLists(newLists);
    setLocalLists(newLists);
    currentStateRef.current = newLists;

    // Clear existing timeout
    if (autoSyncTimeoutRef.current) {
      clearTimeout(autoSyncTimeoutRef.current);
    }

    // Set up auto-sync after 2 seconds of inactivity
    if (isSignedIn) {
      autoSyncTimeoutRef.current = setTimeout(() => {
        uploadToServer(newLists);
      }, 2000);
    }
  }, [isSignedIn, uploadToServer, setLocalLists]);

  // Initialize sync when signing in
  useEffect(() => {
    if (isSignedIn && !initialized) {
      loadFromServer();
    }
  }, [isSignedIn, initialized, loadFromServer]);

  // Set up real-time sync
  useEffect(() => {
    if (!isSignedIn || !user) return;

    const channel = supabase.channel('todo_lists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todo_lists',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          if (!isSyncing) {
            await loadFromServer();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isSignedIn, user, loadFromServer, isSyncing]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSyncTimeoutRef.current) {
        clearTimeout(autoSyncTimeoutRef.current);
      }
    };
  }, []);

  return {
    lists,
    setLists: updateLists,
    isLoading: false,
    error,
    isSignedIn,
    syncWithServer: () => uploadToServer(currentStateRef.current),
    loadFromServer,
    uploadToServer,
  };
}
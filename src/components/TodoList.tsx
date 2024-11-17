import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DraggableTodoItem from './DraggableTodoItem';
import { TodoItem } from '../types/todo';

interface Props {
  todos: TodoItem[];
  onReorder: (newTodos: TodoItem[]) => void;
  onUpdate: (id: string, updates: Partial<TodoItem>) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onIndent: (id: string) => void;
  onOutdent: (id: string) => void;
}

export default function TodoList({
  todos,
  onReorder,
  onUpdate,
  onKeyDown,
  onDelete,
  onDuplicate,
  onIndent,
  onOutdent,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 1000,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      onReorder(arrayMove(todos, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {todos.map((todo, index) => {
            const levelIndex = todos
              .filter((t, i) => i < index && t.level === todo.level)
              .length;

            return (
              <DraggableTodoItem
                key={todo.id}
                item={todo}
                index={levelIndex}
                onUpdate={onUpdate}
                onKeyDown={onKeyDown}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onIndent={onIndent}
                onOutdent={onOutdent}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
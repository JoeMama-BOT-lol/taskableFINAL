import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoItem from './TodoItem';
import { TodoItem as TodoItemType } from '../types/todo';

interface Props {
  item: TodoItemType;
  index: number;
  onUpdate: (id: string, updates: Partial<TodoItemType>) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onIndent: (id: string) => void;
  onOutdent: (id: string) => void;
}

export default function DraggableTodoItem({
  item,
  index,
  onUpdate,
  onKeyDown,
  onDelete,
  onDuplicate,
  onIndent,
  onOutdent,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem
        item={item}
        index={index}
        onUpdate={onUpdate}
        onKeyDown={onKeyDown}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onIndent={onIndent}
        onOutdent={onOutdent}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
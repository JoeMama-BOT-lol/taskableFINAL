import React, { useRef, useState, useEffect } from 'react';
import { Check, MoreVertical, Trash2, Calendar, Clock, AlertTriangle, Type, Bold, Italic, Underline } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { TodoItem as TodoItemType } from '../types/todo';
import { useSettings } from '../hooks/useSettings';
import 'react-day-picker/dist/style.css';

interface Props {
  item: TodoItemType;
  index: number;
  onUpdate: (id: string, updates: Partial<TodoItemType>) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onIndent: (id: string) => void;
  onOutdent: (id: string) => void;
  dragHandleProps?: {
    [key: string]: any;
  };
}

const textSizes = [
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Medium' },
  { value: 'text-lg', label: 'Large' },
  { value: 'text-2xl', label: 'Extra Large' },
  { value: 'text-4xl', label: 'Super Large' },
];

const getNumbering = (level: number, index: number, showNumbering: boolean): string => {
  if (!showNumbering) return '';
  
  const levelPrefixes = ['1', 'a', 'i', '•'];
  const prefix = levelPrefixes[level] || '•';
  
  if (prefix === '•') return prefix + ' ';
  
  if (prefix === 'a') {
    return String.fromCharCode(97 + index) + '. ';
  }
  
  if (prefix === 'i') {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
    return (romanNumerals[index] || 'x') + '. ';
  }
  
  return (index + 1) + '. ';
};

const formatDateTime = (dueDate: string | null | undefined, dueTime: string | undefined, showDayOfWeek: boolean, showYear: boolean): string | null => {
  if (!dueDate && !dueTime) return null;
  
  const parts = [];
  if (dueDate) {
    const format = [
      showDayOfWeek ? 'EEEE' : '',
      'MMM d',
      showYear ? 'yyyy' : ''
    ].filter(Boolean).join(', ');
    
    parts.push(formatInTimeZone(parseISO(dueDate), 'America/New_York', format));
  }
  if (dueTime) {
    const timeParts = dueTime.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    parts.push(`${formattedHours}:${minutes} ${period}`);
  }
  
  return parts.join(' at ');
};

export default function TodoItem({ 
  item, 
  index,
  onUpdate, 
  onKeyDown, 
  onDelete, 
  onDuplicate,
  onIndent,
  onOutdent,
  dragHandleProps
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { showNumbering, showDayOfWeek, showYear, zoom } = useSettings();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, { 
      title: e.target.value,
      isEmpty: e.target.value.trim() === ''
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        onOutdent(item.id);
      } else {
        onIndent(item.id);
      }
    } else {
      onKeyDown(e, item.id);
    }
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };

  const getPopoverPosition = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: 'absolute' as const,
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    };
  };

  const numbering = getNumbering(item.level, index, showNumbering);
  const dateTimeDisplay = formatDateTime(item.dueDate, item.dueTime, showDayOfWeek, showYear);
  const isSmallScreen = windowWidth < 768;

  return (
    <div 
      className="group flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors relative overflow-visible"
      style={{ marginLeft: `${item.level * 24}px` }}
      {...dragHandleProps}
    >
      <button
        onClick={() => onUpdate(item.id, { completed: !item.completed })}
        className={`w-5 h-5 rounded border ${
          item.completed
            ? 'bg-blue-500 border-blue-500 text-white'
            : 'border-gray-300 dark:border-gray-600'
        } flex items-center justify-center transition-colors`}
      >
        {item.completed && <Check size={14} />}
      </button>

      {numbering && (
        <span className="text-gray-400 dark:text-gray-600 select-none">
          {numbering}
        </span>
      )}

      <input
        ref={inputRef}
        type="text"
        value={item.title}
        onChange={handleTitleChange}
        onKeyDown={handleKeyDown}
        className={`flex-1 bg-transparent border-none outline-none focus:ring-0 ${
          item.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
        } ${item.textSize || 'text-base'} ${item.isBold ? 'font-bold' : ''} ${
          item.isItalic ? 'italic' : ''
        } ${item.isUnderline ? 'underline' : ''}`}
        placeholder="What needs to be done?"
      />

<div className="flex items-center gap-4 min-w-[200px] justify-end">
  {/* Priority indicator pushed further left */}
  {item.priority && (
    <div 
      className="flex-shrink-0" 
      style={{ 
        transform: `scale(${zoom})`, 
        transformOrigin: 'center',
        marginRight: '48px' // Fixed larger margin to push it away from date
      }}
    >
      <AlertTriangle
        size={16}
        className={`${
          item.priority === 'high'
            ? 'text-red-500'
            : item.priority === 'medium'
            ? 'text-yellow-500'
            : 'text-blue-500'
        }`}
      />
    </div>
  )}

  {dateTimeDisplay && (
    <div 
      className="flex-grow text-right"
      style={{ 
        transform: `scale(${zoom})`, 
        transformOrigin: 'right center'
      }}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {dateTimeDisplay}
      </span>
    </div>
  )}

  <div className="relative">
    <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <MoreVertical size={16} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 z-50"
                align="end"
                side="bottom"
                sideOffset={5}
              >
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsDatePickerOpen(!isDatePickerOpen);
                    }}
                    className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Calendar size={16} className="mr-2" />
                    Due Date {item.dueDate ? `(${format(parseISO(item.dueDate), 'MMM d')})` : ''}
                  </button>
                  
                  {isDatePickerOpen && (
                    <div className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                      <DayPicker
                        mode="single"
                        selected={item.dueDate ? parseISO(item.dueDate) : undefined}
                        onSelect={(date) => {
                          onUpdate(item.id, {
                            dueDate: date ? format(date, 'yyyy-MM-dd') : null
                          });
                          setIsDatePickerOpen(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Updated time picker using Popover */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button
                      className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Clock size={16} className="mr-2" />
                      Due Time {item.dueTime ? `(${item.dueTime})` : ''}
                    </button>
                  </Popover.Trigger>

                  <Popover.Portal>
                    <Popover.Content
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50"
                      side="right"
                      align="start"
                      sideOffset={5}
                    >
                      <input
                        type="time"
                        value={item.dueTime || ''}
                        onChange={(e) => {
                          onUpdate(item.id, { dueTime: e.target.value });
                        }}
                        className="block w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>


                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <AlertTriangle size={16} className="mr-2" />
                    Priority {item.priority ? `(${item.priority})` : ''}
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent 
                      className="min-w-[120px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 z-50"
                      alignOffset={-5}
                    >
                      <DropdownMenu.Item
                        onSelect={() => handleMenuAction(() => onUpdate(item.id, { priority: 'high' }))}
                        className="flex items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        High
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => handleMenuAction(() => onUpdate(item.id, { priority: 'medium' }))}
                        className="flex items-center px-2 py-1.5 text-sm text-yellow-600 hover:bg-yellow-50 rounded cursor-pointer"
                      >
                        Medium
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => handleMenuAction(() => onUpdate(item.id, { priority: 'low' }))}
                        className="flex items-center px-2 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        Low
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => handleMenuAction(() => onUpdate(item.id, { priority: null }))}
                        className="flex items-center px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        None
                      </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>

                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Type size={16} className="mr-2" />
                    Text Size
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent 
                      className="min-w-[120px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 z-50"
                      alignOffset={-5}
                    >
                      {textSizes.map((size) => (
                        <DropdownMenu.Item
                          key={size.value}
                          onSelect={() => handleMenuAction(() => onUpdate(item.id, { textSize: size.value }))}
                          className="flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          {size.label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>

                <DropdownMenu.Item
                  onSelect={() => handleMenuAction(() => onUpdate(item.id, { isBold: !item.isBold }))}
                  className="flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  <Bold size={16} className="mr-2" />
                  Bold
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={() => handleMenuAction(() => onUpdate(item.id, { isItalic: !item.isItalic }))}
                  className="flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  <Italic size={16} className="mr-2" />
                  Italic
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={() => handleMenuAction(() => onUpdate(item.id, { isUnderline: !item.isUnderline }))}
                  className="flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  <Underline size={16} className="mr-2" />
                  Underline
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

                <DropdownMenu.Item
                  onSelect={() => handleMenuAction(() => onDuplicate(item.id))}
                  className="flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  Duplicate
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={() => handleMenuAction(() => onDelete(item.id))}
                  className="flex items-center px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded cursor-pointer"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}
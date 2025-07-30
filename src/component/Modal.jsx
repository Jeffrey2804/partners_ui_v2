import { useState, useContext, useEffect, useRef } from 'react';
import { TaskContext } from '../context/TaskContext';
import toast, { Toaster } from 'react-hot-toast';
import TagInput from './TagInput';
import ActionInput from './ActionInput';
import Draggable from 'react-draggable';

const Modal = ({ task, onClose, onSave, categorySelector }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [date, setDate] = useState(task?.date || '');
  const [tags, setTags] = useState(
    Array.isArray(task?.tags)
      ? task.tags.map((tag) =>
          typeof tag === 'string' ? { label: tag, value: tag } : tag
        )
      : []
  );
  const [actions, setActions] = useState(
    Array.isArray(task?.actions)
      ? task.actions.map((a) =>
          typeof a === 'string' ? { label: a, value: a } : a
        )
      : []
  );
  const [errors, setErrors] = useState({ title: false, date: false });

  const { updateTask, deleteTask } = useContext(TaskContext);
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    const hasError = {
      title: !title.trim(),
      date: !date.trim(),
    };

    setErrors(hasError);

    if (hasError.title || hasError.date) {
      toast.error('Title and Date are required');
      return;
    }

    const updatedTask = {
      ...task,
      title,
      date,
      tags: tags.length ? tags.map((t) => t.value) : ['General'],
      actions: actions.length ? actions.map((a) => a.value) : ['Follow Up'],
    };

    if (onSave) {
      onSave(updatedTask);
      toast.success('Task created successfully!');
    } else {
      updateTask(updatedTask);
      toast.success('Task updated successfully!');
    }

    onClose();
  };

  const handleDelete = () => {
    if (task?.id) {
      deleteTask(task.id);
      toast.success('Task deleted');
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <Toaster position="top-right" />
      <Draggable handle=".drag-handle">
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-700 animate-fade-in text-black dark:text-white cursor-default"
          onKeyDown={handleKeyDown}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight drag-handle cursor-move select-none">
            {onSave ? 'Create New Task' : 'Edit Task'}
          </h2>

          {categorySelector && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Category</span>
              {categorySelector}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</span>
            <input
              ref={titleInputRef}
              className={`w-full border rounded px-3 py-2 mt-1 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2
                ${errors.title ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-teal-500'}`}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</span>
            <input
              type="date"
              className={`w-full border rounded px-3 py-2 mt-1 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2
                ${errors.date ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-teal-500'}`}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</span>
            <TagInput value={tags} onChange={setTags} max={5} />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions</span>
            <ActionInput value={actions} onChange={setActions} max={5} />
          </label>

          <div className="flex justify-between items-center gap-3">
            {!onSave && (
              <button
                className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            <div className="ml-auto flex gap-3">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={handleSave}
              >
                {onSave ? 'Create Task' : 'Update Task'}
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default Modal;

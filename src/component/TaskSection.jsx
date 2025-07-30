import { useContext, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { motion, AnimatePresence } from 'framer-motion';

// Hook for draggable TaskCard
const DraggableCard = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {typeof children === 'function'
        ? children({ isDragging, listeners, attributes, setNodeRef })
        : children}
    </div>
  );
};

const TaskSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const [filter, setFilter] = useState('All');
  const [categoryOrder, setCategoryOrder] = useState(Object.keys(tasksByCategory));

  const categories = Object.keys(tasksByCategory);
  const filteredCategories =
    filter === 'All' ? categoryOrder : categoryOrder.filter((c) => c === filter);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categoryOrder.indexOf(active.id);
      const newIndex = categoryOrder.indexOf(over.id);
      setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: 'easeOut'
      }
    }),
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      filter: 'blur(6px)',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="tasks-section w-full px-4 sm:px-6 md:px-10 py-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-lg bg-white dark:bg-gray-900"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center gap-2">
            📋 Task Overview
          </h2>
          <div className="mt-1 h-1 w-28 bg-gradient-to-r from-[#01818E] to-cyan-400 rounded-full" />
        </div>

        {/* Category Filter */}
        <motion.select
          key={filter}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onChange={handleFilterChange}
          value={filter}
          className="px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:ring-2 hover:ring-[#01818E] transition-all duration-300"
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </motion.select>
      </div>

      {/* Draggable Cards */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredCategories} strategy={verticalListSortingStrategy}>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredCategories.map((category, idx) => (
                <motion.div
                  key={category}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="will-change-transform"
                >
                  <DraggableCard id={category}>
                    {({ isDragging, listeners, attributes, setNodeRef }) => (
                      <TaskCard
                        id={category}
                        title={category}
                        color={tasksByCategory[category].color || 'gray'}
                        tasks={tasksByCategory[category].items}
                        listeners={listeners}
                        attributes={attributes}
                        setNodeRef={setNodeRef}
                        isDragging={isDragging}
                      />
                    )}
                  </DraggableCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
    </motion.section>
  );
};

export default TaskSection;

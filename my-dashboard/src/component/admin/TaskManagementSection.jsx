import { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import TaskCard from './TaskCard';
import Modal from '../Modal';
import { TaskContext } from '../../context/TaskContext';
import { supabase } from '../../lib/supabaseClient';

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const TaskManagementSection = () => {
  const { addTask } = useContext(TaskContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitles, setTaskTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    const fetchTitles = async () => {
      const { data, error } = await supabase.from('task_templates').select('title');
      if (!error && data?.length) {
        setTaskTitles(data.map((item) => item.title));
      }
      setLoading(false);
    };
    fetchTitles();
  }, []);

  const handleCreate = (newTask) => {
    addTask("Today's Tasks", {
      ...newTask,
      id: Date.now(),
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = taskTitles.indexOf(active.id);
      const newIndex = taskTitles.indexOf(over.id);
      setTaskTitles((titles) => arrayMove(titles, oldIndex, newIndex));
    }
  };

  return (
    <motion.section
      className="relative space-y-4 px-0 pt-0 pb-0 m-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Glassmorphism Overlay */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent to-zinc-900/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Task List */}
      <div className="relative">
        <div className="absolute right-0 top-0 h-full w-10 pointer-events-none z-10 bg-gradient-to-l from-white" />

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 pr-6">
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={idx}
                className="w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={taskTitles} strategy={verticalListSortingStrategy}>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory pr-6 scroll-smooth">
                {taskTitles.map((title, idx) => (
                  <SortableItem key={title} id={title}>
                    <motion.div
                      role="button"
                      tabIndex={0}
                      aria-label={`Create task from: ${title}`}
                      className="snap-start cursor-pointer hover:shadow-xl focus:outline-none"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 300, delay: idx * 0.05 }}
                      onClick={() => {
                        setSelectedTask({ title });
                        setModalOpen(true);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
                    >
                      <TaskCard title={title} />
                    </motion.div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          task={selectedTask}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={(task) => {
            handleCreate(task);
          }}
        />
      )}
    </motion.section>
  );
};

export default TaskManagementSection;

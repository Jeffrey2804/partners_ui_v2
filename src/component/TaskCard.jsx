import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';

const TaskCard = ({ title, color, tasks, id, listeners, attributes, setNodeRef, isDragging }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleEdit = (task) => setSelectedTask(task);
  const handleClose = () => setSelectedTask(null);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const completedCount = tasks.filter((task) =>
    task.actions?.includes('Completed')
  ).length;
  const completionPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  console.log(tasks)
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 
        overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] 
        ${isDragging ? 'opacity-60 scale-95' : ''}`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-4 py-3 cursor-pointer bg-[#01818E] text-white transition-all"
        onClick={toggleCollapse}
      >
        <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
        <span
          className={`text-lg transform transition-transform duration-300 ${
            collapsed ? 'rotate-0' : 'rotate-180'
          }`}
        >
          ⌄
        </span>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-4 overflow-hidden"
          >
            {/* Progress Bar */}
            {tasks.length > 0 && (
              <>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    layout
                    className="h-full rounded-full"
                    style={{
                      width: '${completionPercent}%',
                      backgroundColor: '#01818E',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {completedCount} of {tasks.length} completed
                </p>
              </>
            )}

            {/* No Tasks */}
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                No tasks available.
              </p>
            ) : (
              tasks.map((task, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.015 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        📅 {task.date || 'No due date'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-xs px-3 py-1 rounded bg-[#01818E]/10 text-[#01818E] hover:bg-[#01818E]/20 dark:text-white dark:bg-[#01818E]/40 dark:hover:bg-[#01818E]/60 transition"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(task.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          tag.includes('High')
                            ? 'bg-red-500 text-white'
                            : tag.includes('Low')
                            ? 'bg-yellow-400 text-black'
                            : tag.includes('Meeting')
                            ? 'bg-gray-500 text-white'
                            : 'bg-[#01818E]/20 text-[#01818E] dark:bg-[#01818E]/30 dark:text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {(task.body || []).map((action, idx) => (
                      <button
                        key={task.id || i}
                        className={`text-xs px-2 py-1 rounded transition font-medium ${
                          action === 'Call'
                            ? 'bg-blue-600 text-white'
                            : action === 'Schedule Now'
                            ? 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white'
                            : action === 'Completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-[#01818E]/20 text-[#01818E] dark:bg-[#01818E]/30 dark:text-white'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTask && <Modal task={selectedTask} onClose={handleClose} />}
    </motion.div>
  );
};

export default TaskCard;
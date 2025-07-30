// === TaskColumn.jsx ===

const TaskColumn = ({ title, color = 'gray', items = [] }) => {
  const borderColor = 'border-[#01818E]';
  const titleColor = 'text-[#01818E]';

  const statusColorMap = {
    'On Track': 'bg-emerald-100 text-emerald-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Overdue': 'bg-red-100 text-red-800',
  };

  const fallbackStatusClass = 'bg-gray-200 text-gray-700';

  return (
    <div
      className={`w-[240px] min-w-[240px] max-w-sm rounded-2xl border ${borderColor} p-4 shadow-md space-y-4 transition-colors duration-300 bg-white`}
    >
      <h3 className={`text-sm font-bold tracking-wide uppercase ${titleColor}`}>{title}</h3>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm italic text-gray-400">No tasks</p>
        ) : (
          items.map((task, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 shadow-sm transition-all duration-200 bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800"
            >
              <h4 className="font-semibold text-sm truncate">{task.title || 'Untitled Task'}</h4>
              <p className="text-xs mt-1 flex items-center gap-1 text-gray-400">
                📅 {task.dueDate || 'No due date'}
              </p>

              {task.statuses?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.statuses.map((status, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        statusColorMap[status] || fallbackStatusClass
                      }`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;

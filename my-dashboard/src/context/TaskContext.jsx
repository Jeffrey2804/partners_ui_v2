import { createContext, useEffect, useState } from 'react';

export const TaskContext = createContext();

const categorizeTasks = (tasks) => {
  const result = {
    "Today's Tasks": { color: 'teal', items: [] },
    'Overdue Tasks': { color: 'orange', items: [] },
    'Upcoming in 48 Hours': { color: 'blue', items: [] },
  };

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  tasks.forEach((task) => {
    const taskDateStr = task.dueDate;
    if (!taskDateStr) return;

    const taskDate = new Date(taskDateStr);
    const formattedDate = taskDate.toISOString().split('T')[0];

    const taskItem = {
      id: task._id,
      title: task.title,
      date: formattedDate,
      tags: task.tags || [],
      actions: task.body,
    };
    if (formattedDate === today) {
      result["Today's Tasks"].items.push(taskItem);
    } else if (taskDate < now) {
      result['Overdue Tasks'].items.push(taskItem);
    } else if (taskDate <= twoDaysLater) {
      result['Upcoming in 48 Hours'].items.push(taskItem);
    }
  });

  return result;
};

const fetchAndTransformTasks = async () => {
  try {
    const response = await fetch(
      'https://services.leadconnectorhq.com/locations/b7vHWUGVUNQGoIlAXabY/tasks/search',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify({ completed: false }),
      }
    );

    if (!response.ok) {
      throw new Error('HTTP error! Status: ${response.status}');
    }

    const data = await response.json();
    const tasks = data.tasks || data;
    
    return categorizeTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      "Today's Tasks": { color: 'teal', items: [] },
      'Overdue Tasks': { color: 'orange', items: [] },
      'Upcoming in 48 Hours': { color: 'blue', items: [] },
    };
  }
};

export const TaskProvider = ({ children }) => {
  const [tasksByCategory, setTasksByCategory] = useState(null);

  useEffect(() => {
    fetchAndTransformTasks().then((data) => {
      console.log(data)
      setTasksByCategory(data);
    });
  }, []);

  const addTask = (category, task) => {
    const newTask = {
      ...task,
      id: task.id || '${Date.now()}',
    };

    setTasksByCategory((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: [...prev[category].items, newTask],
      },
    }));
  };

  const updateTask = (updatedTask) => {
    setTasksByCategory((prev) => {
      const newState = {};
      for (const category in prev) {
        newState[category] = {
          ...prev[category],
          items: prev[category].items.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        };
      }
      return newState;
    });
  };

  const deleteTask = (taskId) => {
    setTasksByCategory((prev) => {
      const newState = {};
      for (const category in prev) {
        newState[category] = {
          ...prev[category],
          items: prev[category].items.filter((task) => task.id !== taskId),
        };
      }
      return newState;
    });
  };

  const reorderTasks = (category, newItemOrder) => {
    setTasksByCategory((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: newItemOrder,
      },
    }));
  };

  const moveTaskToCategory = (fromCategory, toCategory, taskId) => {
    setTasksByCategory((prev) => {
      const taskToMove = prev[fromCategory].items.find((t) => t.id === taskId);
      if (!taskToMove) return prev;

      return {
        ...prev,
        [fromCategory]: {
          ...prev[fromCategory],
          items: prev[fromCategory].items.filter((t) => t.id !== taskId),
        },
        [toCategory]: {
          ...prev[toCategory],
          items: [...prev[toCategory].items, taskToMove],
        },
      };
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasksByCategory,
        setTasksByCategory,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        moveTaskToCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
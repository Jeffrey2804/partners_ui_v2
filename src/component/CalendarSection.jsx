import { useState, useEffect, useContext, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import toast, { Toaster } from 'react-hot-toast';
import { TaskContext } from '../context/TaskContext';
import './Calendar.css';

const categoryColors = {
  Activity: '#01818E',
  Campaign: '#01818E',
  Email: '#01818E',
  Task: '#01818E',
};

const getNextWeekISO = (start, weeks) => {
  const d = new Date(start);
  d.setDate(d.getDate() + 7 * weeks);
  return d.toISOString().split('T')[0];
};

const CalendarSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Activity', repeat: false });
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('calendarEvents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const taskEvents = useMemo(() => {
    return Object.values(tasksByCategory).flatMap(({ items }) =>
      items.map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        start: task.date,
        category: 'Task',
        color: categoryColors.Task,
      }))
    );
  }, [tasksByCategory]);

  useEffect(() => {
    setEvents((prev) => {
      const nonTaskEvents = prev.filter((e) => !e.id?.startsWith('task-'));
      return [
        ...nonTaskEvents,
        ...taskEvents.filter((task) => !nonTaskEvents.some((e) => e.id === task.id))
      ];
    });
  }, [taskEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (e) =>
        (filter === 'All' || e.category === filter) &&
        e.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, filter, search]);

  const openAddModal = (dateStr) => {
    setSelectedDate(dateStr);
    setForm({ title: '', category: 'Activity', repeat: false });
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = ({ event, startStr }) => {
    setSelectedDate(startStr);
    setForm({
      title: event.title,
      category: event.extendedProps.category,
      repeat: false,
    });
    setEditId(event.id);
    setModalOpen(true);
  };

  const saveEvent = () => {
    if (!form.title || !selectedDate) return;

    const base = {
      title: form.title,
      category: form.category,
      color: categoryColors[form.category] || '#01818E',
    };

    if (editId) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editId ? { ...e, ...base, start: selectedDate } : e))
      );
      toast.success('Event updated');
    } else {
      const id = Date.now().toString();
      const newEntries = form.repeat
        ? [...Array(4)].map((_, i) => ({
            ...base,
            id: `${id}-${i}`,
            start: getNextWeekISO(selectedDate, i),
          }))
        : [{ ...base, id, start: selectedDate }];
      setEvents((prev) => [...prev, ...newEntries]);
      toast.success(form.repeat ? 'Recurring events added!' : 'Event added');
    }

    setModalOpen(false);
  };

  const deleteEvent = () => {
    setEvents((prev) => prev.filter((e) => e.id !== editId));
    toast.success('Event deleted');
    setModalOpen(false);
  };

  return (
    <section className="p-4 sm:p-6 md:p-8 bg-gray-100 text-gray-800">
      <Toaster position="top-right" />

      <div className="shadow-lg rounded-2xl bg-white p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">📅 Calendar</h2>

          <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="text-sm border border-gray-300 rounded px-3 py-1"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {['All', 'Activity', 'Campaign', 'Email', 'Task'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded bg-[#01818E] text-white hover:bg-[#01727d]"
            >
              ➕ Add appointment
            </button>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          editable
          selectable
          dateClick={(info) => openAddModal(info.dateStr)}
          eventClick={openEditModal}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          events={filteredEvents}
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? 'Edit Event' : 'Add Event'}
            </h3>

            <input
              type="text"
              className="w-full mb-3 p-2 border rounded"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <select
              className="w-full mb-3 p-2 border rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {['Activity', 'Campaign', 'Email'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {!editId && (
              <label className="flex items-center gap-2 mb-4 text-sm">
                <input
                  type="checkbox"
                  checked={form.repeat}
                  onChange={(e) => setForm({ ...form, repeat: e.target.checked })}
                />
                Repeat weekly for 4 weeks
              </label>
            )}

            <div className="flex justify-end gap-2">
              {editId && (
                <button onClick={deleteEvent} className="px-4 py-2 bg-red-600 text-white rounded">
                  Delete
                </button>
              )}
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button
                onClick={saveEvent}
                className="px-4 py-2 bg-[#01818E] text-white rounded hover:bg-[#01727d]"
              >
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CalendarSection;

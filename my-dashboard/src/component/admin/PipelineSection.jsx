import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useRef, useState, useMemo, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';
import PipelineColumn from './PipelineColumn';
import { Plus } from 'lucide-react';
import { PipelineContext } from '../../context/PipelineContext';

const initialStages = [
  { title: 'Application Received', color: 'bg-teal-600' },
  { title: 'Pre-Approval Issued', color: 'bg-gray-500' },
  { title: 'In Processing', color: 'bg-cyan-500' },
  { title: 'Submitted to Underwriting', color: 'bg-rose-500' },
  { title: 'Conditional Approval', color: 'bg-amber-400' },
  { title: 'Docs Out / Scheduled to Close', color: 'bg-lime-500' },
  { title: 'Post-Close Follow-Up', color: 'bg-indigo-500' },
];

const PipelineSection = ({ onMove }) => {
  const { leadsByStage } = useContext(PipelineContext);
  const scrollRef = useRef(null);
  const [localData, setLocalData] = useState(leadsByStage);
  const [collapsed, setCollapsed] = useState({});
  const [visibleStages, setVisibleStages] = useState(initialStages.map((s) => s.title));
  const [overStage, setOverStage] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setLocalData(leadsByStage);
  }, [leadsByStage]);

  useEffect(() => {
    const channel = supabase
      .channel('leads-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        const updated = payload.new;

        setLocalData((prev) => {
          const newData = { ...prev };
          for (const stage of initialStages) {
            newData[stage.title] = newData[stage.title].filter((i) => i.name !== updated.name);
          }
          if (!newData[updated.stage]) newData[updated.stage] = [];
          newData[updated.stage].push(updated);
          return newData;
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const syncToSupabase = async (item, newStage) => {
    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage })
      .eq('name', item.name);
    error
      ? toast.error('❌ Failed to sync')
      : toast.success(`✅ Moved to ${newStage}`);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setOverStage(null);
    if (!over || active.id === over.id) return;

    const fromStage = active.data.current.stage;
    const toStage = over.data.current.stage;

    if (fromStage === toStage) {
      const oldIndex = active.data.current.index;
      const newIndex = over.data.current.index;
      const newItems = [...localData[fromStage]];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      setLocalData({ ...localData, [fromStage]: newItems });
    } else {
      const item = localData[fromStage].find((i) => i.name === active.id);
      const updatedFrom = localData[fromStage].filter((i) => i.name !== active.id);
      const updatedTo = [item, ...localData[toStage]];

      setLocalData({ ...localData, [fromStage]: updatedFrom, [toStage]: updatedTo });
      toast.success(`Moved '${item.name}' to '${toStage}'`);
      syncToSupabase(item, toStage);
      if (onMove) onMove(item, fromStage, toStage);
    }
  };

  const handleToggleCollapse = (title) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const filteredStages = useMemo(() => {
    return initialStages.filter((s) => visibleStages.includes(s.title));
  }, [visibleStages]);

  return (
    <section className="relative w-full space-y-4 transition-all duration-500 ease-in-out">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-20 flex justify-between items-center bg-gradient-to-r from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-5 shadow-lg border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">📈</span>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            Loan Pipeline
          </h2>
        </div>
      </motion.div>

      {/* Stage Filter with Enhanced Visual Indicators */}
      <div className="px-4 flex flex-wrap gap-3">
        {initialStages.map((s, idx) => {
          const isVisible = visibleStages.includes(s.title);
          return (
            <motion.button
              key={s.title}
              onClick={() =>
                setVisibleStages((prev) =>
                  isVisible ? prev.filter((t) => t !== s.title) : [...prev, s.title]
                )
              }
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`px-4 py-2 text-sm font-semibold rounded-full text-white transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl bg-gradient-to-r from-[#01818E] to-[#01B5A6] relative overflow-hidden`}
            >
              {s.title}
              <span
                className={`absolute top-1 right-1 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-md transition-all duration-300 animate-ping ${
                  isVisible ? 'bg-yellow-400' : 'bg-gray-400 opacity-50'
                }`}
              ></span>
            </motion.button>
          );
        })}
      </div>

      {/* Pipeline Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={(e) =>
          setOverStage(e.over?.data?.current?.stage || null)
        }
      >
        <motion.div
          ref={scrollRef}
          className="flex gap-4 px-4 py-4 overflow-x-auto snap-x snap-mandatory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredStages.map((stage, idx) => {
            const items = localData[stage.title] || [];
            const onTrack = items.filter((c) => c.status === 'On Track').length;
            const progress = items.length > 0 ? Math.round((onTrack / items.length) * 100) : 0;
            const isOver = overStage === stage.title;
            const isCollapsed = collapsed[stage.title];

            return (
              <motion.div
                key={idx}
                initial={{ x: 100 * idx, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`min-w-[320px] max-w-[340px] rounded-xl shadow-inner bg-white dark:bg-gray-800 p-4 transition-all duration-300 ${isOver ? 'ring-4 ring-sky-500 scale-[1.01]' : ''}`}
              >
                {/* Column Component */}
                {!isCollapsed && (
                  <PipelineColumn
                    stage={stage}
                    items={items}
                    progress={progress}
                    lastUpdated="today"
                    isOver={isOver}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </DndContext>
    </section>
  );
};

export default PipelineSection;

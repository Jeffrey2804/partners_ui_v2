import { motion } from 'framer-motion';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@radix-ui/react-tooltip';

const colorMap = {
  teal: 'bg-[#01818E]',
  gray: 'bg-gray-500',
  blue: 'bg-blue-600',
  red: 'bg-red-600',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
};

const PipelineCard = ({
  stage,
  color,
  icon,
  leadCount,
  avgTime,
  conversion,
  title,
  desc,
  className = '',
  delay = 0,
}) => {
  const percent = parseFloat(conversion?.replace('%', '') || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`group w-[220px] sm:w-[240px] md:w-[260px] h-[340px] flex flex-col
        bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700
        rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1.5
        transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 text-white rounded-t-2xl font-medium tracking-wide ${colorMap[color] || 'bg-[#01818E]'}`}
      >
        <span className="text-sm flex items-center gap-2">
          {icon} {stage}
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-lg opacity-60 hover:opacity-100 cursor-pointer">⋮</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-3 text-sm space-y-2 text-gray-700 dark:text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Leads</span>
          <span className="font-semibold">{leadCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Avg Time</span>
          <span className="font-semibold">{avgTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Conversion</span>
          <span className="font-semibold">{conversion}</span>
        </div>

        {/* Animated Conversion Bar */}
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#01818E] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-700">
        <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 truncate">
          {title}
        </h4>
        <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-300">{desc}</p>
      </div>
    </motion.article>
  );
};

export default PipelineCard;

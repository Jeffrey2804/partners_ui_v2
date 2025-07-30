// components/Breadcrumb.jsx
import { HiHome, HiChevronRight } from 'react-icons/hi2';

const Breadcrumb = ({ path = [] }) => (
  <nav
    className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2"
    aria-label="Breadcrumb"
  >
    <HiHome className="text-lg text-gray-400 dark:text-gray-500" />

    {path.map((segment, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <HiChevronRight className="text-gray-400 dark:text-gray-500" />
        <span
          className={`${
            idx === path.length - 1
              ? 'text-gray-800 dark:text-gray-200 font-semibold'
              : 'hover:underline cursor-pointer'
          }`}
        >
          {segment}
        </span>
      </div>
    ))}
  </nav>
);

export default Breadcrumb;

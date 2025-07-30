import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <motion.div
        className="text-center space-y-6 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-6xl">⛔</div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Unauthorized Access
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          You don’t have the necessary permissions to view this page.
        </p>

        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-teal-600 text-white rounded shadow hover:bg-teal-700 transition"
          >
            Go Back Home
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Login as Different User
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;

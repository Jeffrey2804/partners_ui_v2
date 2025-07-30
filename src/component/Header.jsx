import SearchBox from './SearchBox';
import ProfileInfo from './ProfileInfo';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { user } = useUser();

  const displayName = user?.name || 'Admin User';
  const role = user?.tier || 'User';
  const greeting =
    role.toLowerCase() === 'admin'
      ? `Welcome back, Admin ${displayName}`
      : `Welcome back, ${displayName}`;

  const subtext =
    role.toLowerCase() === 'admin'
      ? 'Here’s a full overview of your system insights today'
      : 'Let’s take a detailed look at your financial situation today';

  return (
    <header className="w-full bg-[#01818E] text-white shadow-md dark:shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-6 gap-x-10 px-6 sm:px-10 py-8 sm:py-10"
      >
        {/* Left: Logo + Greeting */}
        <div className="flex items-start gap-4 md:gap-6">
          <img
            src="https://i.ibb.co/rK44TsnC/logo.png"
            alt="logo"
            className="h-16 w-auto md:h-20 object-contain rounded-xl shadow-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug tracking-tight drop-shadow-sm dark:drop-shadow-md">
              {greeting}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-teal-100 font-light mt-1 sm:mt-2">
              {subtext}
            </p>
          </div>
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          <SearchBox />
          <ProfileInfo />
        </div>
      </motion.div>
    </header>
  );
};

export default Header;

// SearchBox.jsx
const SearchBox = () => (
  <form
    className="relative animate-fade-in w-full max-w-xs sm:max-w-sm hidden md:block"
    action="#"
    method="get"
    style={{ marginLeft: '-400px' }} // ✅ Custom left shift on larger screens
  >
    <label htmlFor="search" className="sr-only">
      Search
    </label>
    <input
      id="search"
      type="text"
      placeholder="Search here..."
      className="w-full pr-10 px-5 py-3 rounded-full shadow-inner
                 bg-white text-gray-700 placeholder-gray-400
                 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-teal-500
                 transition-all duration-300"
    />
    <button
      type="submit"
      aria-label="Search"
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-blue-500 hover:text-teal-500 dark:text-teal-200 dark:hover:text-teal-300
                 transition text-sm"
    >
      🔍
    </button>
  </form>
);

export default SearchBox;

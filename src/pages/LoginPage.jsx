import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const loggedInUser = {
      id: Date.now(),
      email,
      name: 'Olivia Wilson',
      avatar: 'https://i.ibb.co/rK44TsnC/logo.png',
      tier: role,
    };

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    // ✅ Role-based navigation
    if (role === 'Admin') {
      navigate(`/admin-dashboard/${loggedInUser.id}`);
    } else if (role === 'Production Partner') {
      navigate(`/partner-dashboard/${loggedInUser.id}`);
    } else {
      navigate(`/user-dashboard/${loggedInUser.id}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">Login</h2>

        <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
          required
        />

        <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
          required
        />

        <label htmlFor="role" className="block text-sm text-gray-700 dark:text-gray-200">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Production Partner">Production Partner</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

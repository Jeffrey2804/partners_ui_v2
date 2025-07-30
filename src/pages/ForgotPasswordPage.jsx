import { useState } from 'react';
import { supabase } from '../supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleReset} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">Reset Password</h2>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
        />
        <button
          type="submit"
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium"
        >
          Send Reset Link
        </button>
        {sent && <p className="text-green-500 text-sm text-center">📧 Email sent! Check your inbox.</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;

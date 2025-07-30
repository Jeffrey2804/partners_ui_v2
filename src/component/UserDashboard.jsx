import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import CalendarSection from './CalendarSection';
import { useUser } from '../context/UserContext';

const UserDashboard = () => {
  const { userId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.id !== userId) {
      navigate('/login');
    }
  }, [user, userId, navigate]);

  if (!user || user.id !== userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <p className="text-lg font-semibold">🔐 Redirecting... You must be logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header userId={userId} />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* 🔁 Return to Admin (only if Admin tier) */}
        {user?.tier === 'Admin' && (
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              🔐 Return to Admin
            </button>
          </div>
        )}

        {/* 📅 Personal Calendar Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">📅 Your Calendar</h2>
          <CalendarSection userId={userId} />
        </section>

        {/* 🔍 Optional future sections */}
        {/* <UserMetrics userId={userId} /> */}
        {/* <ProfileInfo userId={userId} /> */}
      </main>
    </div>
  );
};

export default UserDashboard;

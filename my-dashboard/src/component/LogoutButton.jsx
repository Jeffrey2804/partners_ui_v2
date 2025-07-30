import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-500 hover:underline"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

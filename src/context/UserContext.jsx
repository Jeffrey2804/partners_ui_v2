import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId, fallbackSessionUser = null) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      const session = fallbackSessionUser;
      setUser({
        id: session.id,
        email: session.email,
        name: session.user_metadata?.name || 'User',
        avatar: session.user_metadata?.avatar_url || 'https://i.ibb.co/rK44TsnC/logo.png',
        tier: 'Standard',
        role: 'User',
      });
      return;
    }

    setUser({
      id: data.id,
      email: data.email,
      name: data.full_name || 'User',
      avatar: data.avatar_url || 'https://i.ibb.co/rK44TsnC/logo.png',
      tier: data.tier || 'Standard',
      role: data.role || 'User',
    });
  };

  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;
      if (sessionUser) {
        fetchUserDetails(sessionUser.id, sessionUser);
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser) {
        fetchUserDetails(sessionUser.id, sessionUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

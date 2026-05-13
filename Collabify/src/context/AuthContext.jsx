import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah user sudah login saat app dibuka
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile()
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Simpan token & data user setelah login
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Hapus token saat logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
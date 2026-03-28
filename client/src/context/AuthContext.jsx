import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as loginApi, registerUser as registerApi, logoutUser as logoutApi, getCurrentUser } from '../api/auth';
import { getUserById } from '../api/user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('gc_token'));
  const [loading, setLoading] = useState(true);

  // Fetch full user profile from the users table
  const fetchUserProfile = useCallback(async (authUser) => {
    try {
      const res = await getUserById(authUser.id);
      return res.data;
    } catch {
      return authUser;
    }
  }, []);

  // Initialize — check for existing session
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getCurrentUser();
        const authUser = res.data;
        const profile = await fetchUserProfile(authUser);
        setUser(profile);
      } catch {
        localStorage.removeItem('gc_token');
        localStorage.removeItem('gc_refresh_token');
        localStorage.removeItem('gc_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [token, fetchUserProfile]);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const { user: authUser, token: accessToken, refreshToken } = res.data;
    localStorage.setItem('gc_token', accessToken);
    localStorage.setItem('gc_refresh_token', refreshToken);
    setToken(accessToken);
    const profile = await fetchUserProfile(authUser);
    setUser(profile);
    return profile;
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    const { user: authUser, token: accessToken, refreshToken } = res.data;
    if (accessToken) {
      localStorage.setItem('gc_token', accessToken);
      localStorage.setItem('gc_refresh_token', refreshToken);
      setToken(accessToken);
    }
    const profile = await fetchUserProfile(authUser);
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Logout even if API fails
    }
    localStorage.removeItem('gc_token');
    localStorage.removeItem('gc_refresh_token');
    localStorage.removeItem('gc_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (user?.id) {
      const profile = await fetchUserProfile(user);
      setUser(profile);
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

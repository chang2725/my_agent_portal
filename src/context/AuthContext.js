// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const sessionTimeoutRef = useRef(null);

  const isAuthenticated = () => {
    return localStorage.getItem('agent') !== null;
  };

  const login = useCallback((agentData) => {
    localStorage.setItem('agent', JSON.stringify(agentData));
    setAgent(agentData);

    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);

    sessionTimeoutRef.current = setTimeout(() => {
      logout();
    }, 60 * 60 * 1000);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('agent');
    setAgent(null);
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const storedAgent = localStorage.getItem('agent');
    if (storedAgent) {
      try {
        const agentData = JSON.parse(storedAgent);
        setAgent(agentData);

        if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);

        sessionTimeoutRef.current = setTimeout(() => {
          logout();
        }, 60 * 60 * 1000);
      } catch (e) {
        console.error("Failed to parse agent data:", e);
        logout();
      }
    }
    setLoading(false); // Set loading to false after checking auth status
  }, [logout]);

  return (
    <AuthContext.Provider value={{ agent, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
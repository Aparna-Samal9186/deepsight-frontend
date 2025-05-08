import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ImageCapture from './components/ImageCapture';
import Dashboard from './components/Dashboard';
import Auth from './auth/Auth';
import SplashScreen from './components/SplashScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // if (token) {
    //   setIsAuthenticated(true);
    // }
    setIsAuthenticated(true);
    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  if (showSplash) {
    return <SplashScreen onLoadingComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth onAuth={handleAuth} />} />
        <Route
          path="/"
          element={isAuthenticated ? <ImageCapture /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

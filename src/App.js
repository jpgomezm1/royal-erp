import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import Navbar from './components/Navbar/Navbar';
import ComercialPage from './Pages/Comercial/ComercialPage';
import FinancieraPage from './Pages/Financiera/FinancieraPage';
import LoginForm from './auth/LoginForm/LoginForm';
import WelcomeDialog from './components/Dialogs/WelcomeDialog';
import GoodbyeDialog from './components/Dialogs/GoodbyeDialog';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showGoodbyeDialog, setShowGoodbyeDialog] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setShowWelcomeDialog(true);
  };

  const handleLogout = () => {
    setShowGoodbyeDialog(true);
  };

  const finalizeLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setShowGoodbyeDialog(false);
  };

  const AuthLayout = ({ children }) => (
    <Box sx={{ display: 'flex' }}>
      <Navbar onLogout={handleLogout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: '280px' },
          backgroundColor: '#1E1E1E',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <AuthLayout>{children}</AuthLayout>;
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WelcomeDialog open={showWelcomeDialog} onClose={() => setShowWelcomeDialog(false)} />
        <GoodbyeDialog open={showGoodbyeDialog} onClose={finalizeLogout} />
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/comercial" /> : <LoginForm onLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={<Navigate to="/comercial" />}
          />
          <Route
            path="/comercial"
            element={
              <ProtectedRoute>
                <ComercialPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financiera"
            element={
              <ProtectedRoute>
                <FinancieraPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;



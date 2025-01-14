import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import theme from './theme/theme';
import Navbar from './components/Navbar/Navbar';
import ComercialPage from './Pages/Comercial/ComercialPage';
import FinancieraPage from './Pages/Financiera/FinancieraPage';
import LoginForm from './auth/LoginForm/LoginForm';
import WelcomeDialog from './components/Dialogs/WelcomeDialog';
import GoodbyeDialog from './components/Dialogs/GoodbyeDialog';

function AppContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showGoodbyeDialog, setShowGoodbyeDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowWelcomeDialog(false);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    console.log('Login success, showing welcome dialog');
    setShowWelcomeDialog(true);
  };

  const handleLogout = () => {
    setShowGoodbyeDialog(true);
  };

  const finalizeLogout = () => {
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
        <WelcomeDialog 
          open={showWelcomeDialog} 
          onClose={() => setShowWelcomeDialog(false)}
          userName={user?.nombre}
        />
        <GoodbyeDialog 
          open={showGoodbyeDialog} 
          onClose={finalizeLogout} 
        />
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/comercial" />
              ) : (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              )
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

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
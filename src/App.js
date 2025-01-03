import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  CssBaseline,
  Box,
  Dialog,
  DialogContent,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  WavingHandOutlined as WavingIcon,
} from '@mui/icons-material';
import theme from './theme/theme';
import Navbar from './components/Navbar/Navbar';
import HomePage from './Pages/HomePage/HomePage';
import ComercialPage from './Pages/Comercial/ComercialPage';
import LoginForm from './auth/LoginForm/LoginForm';

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

  const WelcomeDialog = () => (
    <Dialog
      open={showWelcomeDialog}
      onClose={() => setShowWelcomeDialog(false)}
      PaperProps={{
        sx: {
          backgroundColor: '#2C2C2C',
          border: '1px solid rgba(0, 255, 209, 0.1)',
          borderRadius: 3,
          maxWidth: '400px',
          width: '90%',
        }
      }}
    >
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          py: 2 
        }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#00FFD1',
              mb: 2
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 50, color: '#1E1E1E' }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: '#00FFD1', mb: 1, fontWeight: 600 }}>
            ¡Bienvenido de vuelta!
          </Typography>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 0.5 }}>
            Carlos Giraldo
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#AAAAAA', mb: 3 }}>
            Chief Financial Officer
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowWelcomeDialog(false)}
            sx={{
              backgroundColor: '#00FFD1',
              color: '#1E1E1E',
              '&:hover': {
                backgroundColor: '#00CCB7',
              },
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Comenzar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const GoodbyeDialog = () => (
    <Dialog
      open={showGoodbyeDialog}
      PaperProps={{
        sx: {
          backgroundColor: '#2C2C2C',
          border: '1px solid rgba(0, 255, 209, 0.1)',
          borderRadius: 3,
          maxWidth: '400px',
          width: '90%',
        }
      }}
    >
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          py: 2 
        }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#00FFD1',
              mb: 2
            }}
          >
            <WavingIcon sx={{ fontSize: 50, color: '#1E1E1E' }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: '#00FFD1', mb: 1, fontWeight: 600 }}>
            ¡Hasta pronto!
          </Typography>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 0.5 }}>
            Carlos Giraldo
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAAAAA', mb: 3 }}>
            Gracias por usar nuestro sistema
          </Typography>
          <Button
            variant="contained"
            onClick={finalizeLogout}
            sx={{
              backgroundColor: '#00FFD1',
              color: '#1E1E1E',
              '&:hover': {
                backgroundColor: '#00CCB7',
              },
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

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
          minHeight: '100vh'
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
        <WelcomeDialog />
        <GoodbyeDialog />
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/comercial" element={
            <ProtectedRoute>
              <ComercialPage />
            </ProtectedRoute>
          } />
          <Route path="/financiera" element={
            <ProtectedRoute>
              <div>Sección Financiera</div>
            </ProtectedRoute>
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
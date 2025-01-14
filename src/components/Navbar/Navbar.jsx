import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Button
} from '@mui/material';
import {
  MenuOutlined,
  StorefrontOutlined,
  AccountBalanceOutlined,
  LogoutOutlined
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import logo from '../../assets/royalclub-logo.png';

const navItems = [
  { 
    to: '/comercial', 
    icon: StorefrontOutlined, 
    text: 'Comercial' 
  },
  { 
    to: '/financiera', 
    icon: AccountBalanceOutlined, 
    text: 'Financiera' 
  }
];

const Navbar = ({ onLogout }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.up('sm'));
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) onLogout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#1E1E1E'
    }}>
      <Box sx={{ p: 3 }}>
        <Box 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Link to="/comercial" style={{ textDecoration: 'none' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 1 
            }}>
              <Box
                component="img"
                src={logo}
                alt="Royal Trade Logo"
                sx={{
                  width: '80px',
                  height: 'auto',
                  mb: 1
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#00FFD1',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  letterSpacing: '0.5px'
                }}
              >
                Royal Markets
              </Typography>
              {user && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#FFFFFF',
                    opacity: 0.7,
                    mt: 1
                  }}
                >
                  {user.nombre}
                </Typography>
              )}
            </Box>
          </Link>
        </Box>
        <Divider sx={{ 
          mb: 3, 
          borderColor: 'rgba(0, 255, 209, 0.1)',
          width: '100%'
        }} />
        <List>
          {navItems.map(item => (
            <ListItem
              button
              component={Link}
              to={item.to}
              key={item.text}
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: pathname === item.to ? 'rgba(0, 255, 209, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 209, 0.05)'
                },
                transition: 'all 0.3s ease',
                color: pathname === item.to ? '#00FFD1' : '#FFFFFF',
                padding: '12px 16px',
              }}
            >
              <ListItemIcon>
                <item.icon 
                  sx={{ 
                    color: pathname === item.to ? '#00FFD1' : '#FFFFFF',
                    transition: 'color 0.3s ease',
                    fontSize: '1.5rem'
                  }}
                />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography 
                    sx={{ 
                      fontWeight: pathname === item.to ? 600 : 400,
                      color: pathname === item.to ? '#00FFD1' : '#FFFFFF',
                      transition: 'color 0.3s ease, font-weight 0.3s ease',
                      fontSize: '1rem',
                      letterSpacing: '0.3px'
                    }}
                  >
                    {item.text}
                  </Typography>
                } 
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          startIcon={<LogoutOutlined />}
          fullWidth
          onClick={handleLogout}
          sx={{
            backgroundColor: 'rgba(0, 255, 209, 0.1)',
            color: '#00FFD1',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            border: '1px solid rgba(0, 255, 209, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 209, 0.2)',
              borderColor: 'rgba(0, 255, 209, 0.3)',
            },
            boxShadow: 'none',
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ 
        display: { xs: 'block', sm: 'none' }, 
        p: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
      }}>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: '#00FFD1',
            backgroundColor: 'rgba(0, 255, 209, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 209, 0.2)',
            }
          }}
        >
          <MenuOutlined />
        </IconButton>
      </Box>
      <Drawer
        variant={isMatch ? 'permanent' : 'temporary'}
        open={isMatch ? true : drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            border: 'none',
            backgroundColor: '#1E1E1E',
            boxShadow: '4px 0 10px rgba(0,0,0,0.2)',
            height: '100vh',
            overflowY: 'auto'
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
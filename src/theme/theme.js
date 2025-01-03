import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FFD1',
      light: '#33FFD9',
      dark: '#00CCB7',
      contrastText: '#1E1E1E',
    },
    secondary: {
      main: '#1E1E1E',
      light: '#2C2C2C',
      dark: '#161616',
    },
    background: {
      default: '#1E1E1E',
      paper: '#2C2C2C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E',
          borderRight: '1px solid rgba(0, 255, 209, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        contained: {
          '&:hover': {
            backgroundColor: '#00CCB7',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 255, 209, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 209, 0.2)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 209, 0.05)',
          },
        },
      },
    },
  },
});

export default theme;
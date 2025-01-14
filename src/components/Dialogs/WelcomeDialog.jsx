import React from 'react';
import { Dialog, DialogContent, Box, Avatar, Typography, Button } from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';

const WelcomeDialog = ({ open, onClose, userName }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        backgroundColor: '#2C2C2C',
        border: '1px solid rgba(0, 255, 209, 0.1)',
        borderRadius: 3,
        maxWidth: '400px',
        width: '90%',
      },
    }}
  >
    <DialogContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 2,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#00FFD1',
            mb: 2,
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 50, color: '#1E1E1E' }} />
        </Avatar>
        <Typography variant="h5" sx={{ color: '#00FFD1', mb: 1, fontWeight: 600 }}>
          ¡Bienvenido de vuelta!
        </Typography>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 0.5 }}>
          {userName || 'Usuario'}
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
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

export default WelcomeDialog;
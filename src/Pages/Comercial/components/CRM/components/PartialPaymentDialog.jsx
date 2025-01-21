import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { DateTime } from 'luxon'; // Import just DateTime from luxon

const PartialPaymentDialog = ({ open, onClose, onSave, payment }) => {
  // Initialize fechaAbono as Luxon DateTime object
  const [fechaAbono, setFechaAbono] = useState(DateTime.now());
  const [montoAbono, setMontoAbono] = useState('');

  const handleUseFullAmount = () => {
    if (payment) {
      setMontoAbono(String(payment.monto));
    }
  };

  const handleDateChange = (e) => {
    // Convert the HTML date input value to a Luxon DateTime object
    const newDate = DateTime.fromISO(e.target.value);
    if (newDate.isValid) {
      setFechaAbono(newDate);
    }
  };

  const handleSubmit = () => {
    if (!fechaAbono || !montoAbono) return;
    onSave({
      fecha_abono: fechaAbono.toISO(),
      monto_abono: parseFloat(montoAbono),
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: '#2C2C2C', color: '#FFFFFF' }}>
        Registrar Abono para Pago #{payment?.id}
      </DialogTitle>
      <DialogContent
        sx={{
          bgcolor: '#2C2C2C',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          color: '#FFFFFF',
        }}
      >
        {/* Native date input styled to match theme */}
        <TextField
          type="date"
          label="Fecha de pago real"
          value={fechaAbono ? fechaAbono.toISODate() : ''}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&:hover fieldset': { borderColor: '#FFFFFF' },
              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
            },
            '& .MuiInputLabel-root': { color: '#FFFFFF' },
            '& input': {
              color: '#FFFFFF',
              '&::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)',
              }
            }
          }}
        />
        
        <TextField
          label="Monto Abonado"
          type="number"
          value={montoAbono}
          onChange={(e) => setMontoAbono(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&:hover fieldset': { borderColor: '#FFFFFF' },
              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
            },
            '& .MuiInputLabel-root': { color: '#FFFFFF' },
          }}
        />
        {payment && (
          <Box sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              onClick={handleUseFullAmount}
              sx={{
                borderColor: '#00FFD1',
                color: '#00FFD1',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.08)',
                }
              }}
            >
              Usar Monto Completo
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#2C2C2C', p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ color: '#FFFFFF' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#00FFD1',
            color: '#000000',
            '&:hover': {
              bgcolor: 'rgba(0, 255, 209, 0.8)',
            }
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartialPaymentDialog;


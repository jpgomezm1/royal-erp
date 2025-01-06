import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const paymentMethods = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'bbva', label: 'BBVA' },
];

const initialPaymentState = {
  fecha_pago: null,
  monto: '',
};

const CloseLeadDialog = ({ open, lead, onClose, onSave }) => {
  const [dealData, setDealData] = useState({
    club_privado: false,
    plan_anual: false,
    fecha_inicio_club: null,
    fecha_inicio_plan: null,
    metodo_pago: '',
    monto_total: 0,
    pagos: [],
  });

  const [newPayment, setNewPayment] = useState(initialPaymentState);
  const [errors, setErrors] = useState({});

  const calculateTotalAmount = () => {
    let total = 0;
    if (dealData.club_privado) total += 75;
    if (dealData.plan_anual) total += 270;
    return total;
  };

  const handleProductChange = (product) => {
    const newState = {
      ...dealData,
      [product]: !dealData[product],
    };
    
    // Reset start date if product is unchecked
    if (!newState[product]) {
      newState[`fecha_inicio_${product.split('_')[1]}`] = null;
    }
    
    setDealData(newState);
  };

  const handleAddPayment = () => {
    if (!newPayment.fecha_pago || !newPayment.monto) return;
    
    setDealData({
      ...dealData,
      pagos: [...dealData.pagos, { ...newPayment }],
    });
    setNewPayment(initialPaymentState);
  };

  const handleRemovePayment = (index) => {
    setDealData({
      ...dealData,
      pagos: dealData.pagos.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!dealData.club_privado && !dealData.plan_anual) {
      newErrors.products = 'Selecciona al menos un producto';
    }
    if (dealData.club_privado && !dealData.fecha_inicio_club) {
      newErrors.fecha_inicio_club = 'Selecciona la fecha de inicio';
    }
    if (dealData.plan_anual && !dealData.fecha_inicio_plan) {
      newErrors.fecha_inicio_plan = 'Selecciona la fecha de inicio';
    }
    if (!dealData.metodo_pago) {
      newErrors.metodo_pago = 'Selecciona un método de pago';
    }
    if (dealData.pagos.length === 0) {
      newErrors.pagos = 'Agrega al menos un pago programado';
    }
    
    const totalPayments = dealData.pagos.reduce((sum, p) => sum + Number(p.monto), 0);
    const expectedTotal = calculateTotalAmount();
    if (totalPayments !== expectedTotal) {
      newErrors.pagos = `El total de pagos debe ser igual a $${expectedTotal}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formattedData = {
        ...dealData,
        fecha_inicio_club: dealData.fecha_inicio_club?.toISO(),
        fecha_inicio_plan: dealData.fecha_inicio_plan?.toISO(),
        monto_total: calculateTotalAmount(),
        pagos: dealData.pagos.map(p => ({
          ...p,
          fecha_pago: p.fecha_pago.toISO(),
        })),
      };

      try {
        await onSave(formattedData);
        onClose();
      } catch (error) {
        console.error('Error al cerrar el lead:', error);
      }
    }
  };

  const formatDate = (dateTime) => {
    return dateTime.setLocale('es').toLocaleString(DateTime.DATE_FULL);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es">
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2C2C2C',
            color: '#FFFFFF',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">Cerrar Lead</Typography>
          <Typography variant="subtitle2" sx={{ color: '#00FFD1' }}>
            {lead?.nombre}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Productos */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Productos</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={dealData.club_privado}
                        onChange={() => handleProductChange('club_privado')}
                        sx={{ 
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          }
                        }}
                      />
                    }
                    label="Club Privado ($75)"
                  />
                  {dealData.club_privado && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_club}
                      onChange={(date) => setDealData({ ...dealData, fecha_inicio_club: date })}
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_club,
                          helperText: errors.fecha_inicio_club,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            }
                          }
                        }
                      }}
                    />
                  )}
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={dealData.plan_anual}
                        onChange={() => handleProductChange('plan_anual')}
                        sx={{ 
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          }
                        }}
                      />
                    }
                    label="Plan Anual ($270)"
                  />
                  {dealData.plan_anual && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_plan}
                      onChange={(date) => setDealData({ ...dealData, fecha_inicio_plan: date })}
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_plan,
                          helperText: errors.fecha_inicio_plan,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            }
                          }
                        }
                      }}
                    />
                  )}
                </Box>
              </Box>
              {errors.products && (
                <Typography color="error" variant="caption">{errors.products}</Typography>
              )}
            </Box>

            {/* Método de pago */}
            <FormControl error={!!errors.metodo_pago}>
              <InputLabel sx={{ color: '#FFFFFF' }}>Método de pago</InputLabel>
              <Select
                value={dealData.metodo_pago}
                onChange={(e) => setDealData({ ...dealData, metodo_pago: e.target.value })}
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)'
                  }
                }}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.metodo_pago && (
                <Typography color="error" variant="caption">{errors.metodo_pago}</Typography>
              )}
            </FormControl>

            {/* Pagos programados */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Pagos programados (Total: ${calculateTotalAmount()})
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <DatePicker
                  label="Fecha de pago"
                  value={newPayment.fecha_pago}
                  onChange={(date) => setNewPayment({ ...newPayment, fecha_pago: date })}
                  slotProps={{
                    textField: {
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          color: '#FFFFFF',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        }
                      }
                    }
                  }}
                />
                <TextField
                  label="Monto"
                  type="number"
                  value={newPayment.monto}
                  onChange={(e) => setNewPayment({ ...newPayment, monto: e.target.value })}
                  sx={{
                    '& label': { color: '#FFFFFF' },
                    '& .MuiOutlinedInput-root': {
                      color: '#FFFFFF',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    }
                  }}
                />
                <Button
                  onClick={handleAddPayment}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: '#00FFD1',
                    color: '#1E1E1E',
                    '&:hover': {
                      backgroundColor: '#00CCB7',
                    },
                  }}
                >
                  Agregar
                </Button>
              </Box>

              {dealData.pagos.map((pago, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Typography sx={{ color: '#FFFFFF' }}>
                    {formatDate(pago.fecha_pago)}
                  </Typography>
                  <Chip 
                    label={`$${pago.monto}`}
                    sx={{
                      backgroundColor: '#00FFD1',
                      color: '#1E1E1E'
                    }}
                  />
                  <IconButton 
                    size="small"
                    onClick={() => handleRemovePayment(index)}
                    sx={{ color: '#F44336' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              
              {errors.pagos && (
                <Typography color="error" variant="caption">{errors.pagos}</Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
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
              backgroundColor: '#00FFD1',
              color: '#1E1E1E',
              '&:hover': {
                backgroundColor: '#00CCB7',
              },
            }}
          >
            Cerrar Lead
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CloseLeadDialog;
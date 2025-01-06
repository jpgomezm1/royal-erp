import React, { useState, useEffect } from 'react';
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
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Payment as PaymentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { PLATAFORMAS, PLATAFORMA_COLORS } from '../../../mockData';

const CONCEPTOS = [
  { id: 'plan_anual', label: 'Plan Anual', monto: 270, type: 'fixed' },
  { id: 'club_privado', label: 'Club Privado', monto: 75, type: 'fixed' },
  { id: 'instituto_royal', label: 'Instituto Royal', monto: 2990, type: 'fixed' }, // Nuevo producto
  { id: 'otros', label: 'Otros Ingresos', type: 'custom' }
];

const initialIngresoState = {
  fecha: DateTime.now().toISO(),
  concepto: '',
  nombreCliente: '',
  monto: '',
  plataforma: ''
};

const NewIngresoDialog = ({ open, onClose, onSave }) => {
  const [ingresoData, setIngresoData] = useState(initialIngresoState);
  const [errors, setErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleConceptoSelect = (concepto) => {
    setSelectedPlan(concepto);
    if (concepto.type === 'fixed') {
      setIngresoData({
        ...ingresoData,
        concepto: concepto.label,
        monto: concepto.monto
      });
    } else {
      setIngresoData({
        ...ingresoData,
        concepto: '',
        monto: '',
        nombreCliente: '' // Limpiar nombre del cliente cuando es otro ingreso
      });
    }
    setErrors({ ...errors, concepto: '', monto: '' });
  };

  useEffect(() => {
    if (ingresoData.nombreCliente && selectedPlan?.type === 'fixed') {
      setIngresoData(prev => ({
        ...prev,
        concepto: `${selectedPlan.label} - ${ingresoData.nombreCliente}`
      }));
    }
  }, [ingresoData.nombreCliente, selectedPlan]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedPlan) newErrors.concepto = 'Selecciona un tipo de ingreso';
    if (selectedPlan?.type === 'custom' && !ingresoData.concepto) {
      newErrors.concepto = 'Ingresa el concepto';
    }
    if (selectedPlan?.type === 'fixed' && !ingresoData.nombreCliente) {
      newErrors.nombreCliente = 'Ingresa el nombre del cliente';
    }
    if (!ingresoData.monto || ingresoData.monto <= 0) newErrors.monto = 'El monto debe ser mayor a 0';
    if (!ingresoData.plataforma) newErrors.plataforma = 'Selecciona una plataforma';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Solo incluir nombreCliente si es un plan fijo
      const submitData = {
        ...ingresoData,
        nombreCliente: selectedPlan?.type === 'fixed' ? ingresoData.nombreCliente : undefined
      };
      onSave(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setIngresoData(initialIngresoState);
    setSelectedPlan(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1E1E1E',
          color: '#FFFFFF',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6">Nuevo Ingreso</Typography>
        <IconButton onClick={handleClose} sx={{ color: '#FFFFFF' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Selector de Plan */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#FFFFFF' }}>
              Tipo de Ingreso
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {CONCEPTOS.map((concepto) => (
                <Paper
                  key={concepto.id}
                  onClick={() => handleConceptoSelect(concepto)}
                  sx={{
                    flex: 1,
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: selectedPlan?.id === concepto.id
                      ? 'rgba(0, 255, 209, 0.1)' 
                      : '#2C2C2C',
                    border: '1px solid',
                    borderColor: selectedPlan?.id === concepto.id
                      ? '#00FFD1' 
                      : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#00FFD1',
                      backgroundColor: 'rgba(0, 255, 209, 0.05)'
                    }
                  }}
                >
                  <Typography sx={{ color: '#FFFFFF', fontWeight: 500, mb: 0.5 }}>
                    {concepto.label}
                  </Typography>
                  {concepto.type === 'fixed' && (
                    <Typography variant="body2" sx={{ color: '#00FFD1' }}>
                      ${concepto.monto}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
            {errors.concepto && (
              <Typography variant="caption" sx={{ color: '#f44336', mt: 0.5 }}>
                {errors.concepto}
              </Typography>
            )}
          </Box>

          {/* Campo de Concepto para "Otros" */}
          {selectedPlan?.type === 'custom' && (
            <TextField
              label="Concepto del Ingreso"
              value={ingresoData.concepto}
              onChange={(e) => setIngresoData({ ...ingresoData, concepto: e.target.value })}
              error={!!errors.concepto}
              helperText={errors.concepto}
              sx={{
                '& label': { color: '#FFFFFF' },
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                },
              }}
            />
          )}

          {/* Nombre del Cliente - Solo para planes fijos */}
          {selectedPlan?.type === 'fixed' && (
            <TextField
              label="Nombre del Cliente"
              value={ingresoData.nombreCliente}
              onChange={(e) => setIngresoData({ ...ingresoData, nombreCliente: e.target.value })}
              error={!!errors.nombreCliente}
              helperText={errors.nombreCliente}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: '#00FFD1' }} />,
              }}
              sx={{
                '& label': { color: '#FFFFFF' },
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                },
              }}
            />
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Fecha */}
            <TextField
              type="datetime-local"
              label="Fecha y Hora"
              value={DateTime.fromISO(ingresoData.fecha).toFormat("yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setIngresoData({ 
                ...ingresoData, 
                fecha: DateTime.fromISO(e.target.value).toISO() 
              })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: '#00FFD1' }} />,
              }}
              sx={{
                '& label': { color: '#FFFFFF' },
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                },
              }}
            />

            {/* Monto */}
            <TextField
              label="Monto"
              type="number"
              value={ingresoData.monto}
              onChange={(e) => setIngresoData({ ...ingresoData, monto: parseFloat(e.target.value) })}
              error={!!errors.monto}
              helperText={errors.monto}
              disabled={selectedPlan?.type === 'fixed'}
              fullWidth
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: '#00FFD1' }} />,
              }}
              sx={{
                '& label': { color: '#FFFFFF' },
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                },
              }}
            />
          </Box>

          {/* Plataforma */}
          <FormControl error={!!errors.plataforma}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Plataforma de Pago</InputLabel>
            <Select
              value={ingresoData.plataforma}
              onChange={(e) => setIngresoData({ ...ingresoData, plataforma: e.target.value })}
              label="Plataforma de Pago"
              startAdornment={<PaymentIcon sx={{ ml: 1, mr: 1, color: '#00FFD1' }} />}
              sx={{
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFFFFF'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00FFD1'
                }
              }}
            >
              {PLATAFORMAS.map((plataforma) => (
                <MenuItem 
                  key={plataforma} 
                  value={plataforma}
                  sx={{
                    '&:hover': {
                      backgroundColor: `${PLATAFORMA_COLORS[plataforma]}10`,
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    py: 0.5
                  }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: PLATAFORMA_COLORS[plataforma]
                      }}
                    />
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {plataforma}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.plataforma && (
              <Typography variant="caption" sx={{ color: '#f44336', mt: 0.5 }}>
                {errors.plataforma}
              </Typography>
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewIngresoDialog;
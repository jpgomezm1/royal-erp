import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  Payment as PaymentIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { TIPOS_GASTO, METODOS_PAGO } from '../../../../../constants/gastos';

const defaultEgresoRecurrente = {
  concepto: '',
  monto: '',
  tipo_gasto: '',
  metodo_pago: '',
  descripcion: '',
  dia_cobro: '',
  fecha_inicio: DateTime.now().toFormat("yyyy-MM-dd"),
  fecha_fin: '',
  activo: true
};

const NewEgresoRecurrenteDialog = ({ open, onClose, onSave, egreso = null }) => {
  const [formData, setFormData] = useState(defaultEgresoRecurrente);
  const [errors, setErrors] = useState({});
  const [hasFechaFin, setHasFechaFin] = useState(false);

  useEffect(() => {
    if (egreso) {
      const fechaInicio = DateTime.fromISO(egreso.fecha_inicio).toFormat("yyyy-MM-dd");
      const fechaFin = egreso.fecha_fin 
        ? DateTime.fromISO(egreso.fecha_fin).toFormat("yyyy-MM-dd")
        : '';
      
      setFormData({
        ...egreso,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      });
      setHasFechaFin(!!egreso.fecha_fin);
    } else {
      setFormData(defaultEgresoRecurrente);
      setHasFechaFin(false);
    }
  }, [egreso]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.concepto) newErrors.concepto = 'El concepto es requerido';
    if (!formData.monto || formData.monto <= 0) newErrors.monto = 'El monto debe ser mayor a 0';
    if (!formData.tipo_gasto) newErrors.tipo_gasto = 'El tipo de gasto es requerido';
    if (!formData.metodo_pago) newErrors.metodo_pago = 'El método de pago es requerido';
    if (!formData.dia_cobro || formData.dia_cobro < 1 || formData.dia_cobro > 31) {
      newErrors.dia_cobro = 'El día de cobro debe estar entre 1 y 31';
    }
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    if (hasFechaFin && !formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es requerida';
    if (hasFechaFin && formData.fecha_fin && DateTime.fromISO(formData.fecha_fin) < DateTime.fromISO(formData.fecha_inicio)) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        fecha_fin: hasFechaFin ? formData.fecha_fin : null
      });
    }
  };

  const handleClose = () => {
    setFormData(defaultEgresoRecurrente);
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
          backgroundColor: '#2C2C2C',
          backgroundImage: 'linear-gradient(to bottom right, rgba(255, 99, 71, 0.05), rgba(0, 0, 0, 0))'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <TimeIcon sx={{ color: '#FF6347' }} />
            <Typography variant="h6" component="span" sx={{ color: '#FFFFFF' }}>
              {egreso ? 'Editar Egreso Recurrente' : 'Nuevo Egreso Recurrente'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose}
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box 
          component="form" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5,
            mt: 2 
          }}
        >
          <TextField
            label="Concepto"
            value={formData.concepto}
            onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
            error={!!errors.concepto}
            helperText={errors.concepto}
            fullWidth
            sx={{
              '& label': { color: '#FFFFFF' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#FF6347' },
              },
            }}
          />

          <TextField
            label="Monto"
            type="number"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            error={!!errors.monto}
            helperText={errors.monto}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{
              '& label': { color: '#FFFFFF' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#FF6347' },
              },
              '& .MuiInputAdornment-root': {
                color: '#FFFFFF'
              }
            }}
          />

          <TextField
            label="Día de Cobro"
            type="number"
            value={formData.dia_cobro}
            onChange={(e) => setFormData({ ...formData, dia_cobro: parseInt(e.target.value) })}
            error={!!errors.dia_cobro}
            helperText={errors.dia_cobro || 'Día del mes en que se realizará el cobro'}
            InputProps={{
              inputProps: { min: 1, max: 31 }
            }}
            fullWidth
            sx={{
              '& label': { color: '#FFFFFF' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#FF6347' },
              },
            }}
          />

          <FormControl fullWidth error={!!errors.tipo_gasto}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Tipo de Gasto</InputLabel>
            <Select
              value={formData.tipo_gasto}
              onChange={(e) => setFormData({ ...formData, tipo_gasto: e.target.value })}
              label="Tipo de Gasto"
              sx={{
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFFFFF'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6347'
                }
              }}
            >
              {Object.entries(TIPOS_GASTO).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth error={!!errors.metodo_pago}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Método de Pago</InputLabel>
            <Select
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              label="Método de Pago"
              sx={{
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFFFFF'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6347'
                }
              }}
            >
              {METODOS_PAGO.map((metodo) => (
                <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha de Inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            error={!!errors.fecha_inicio}
            helperText={errors.fecha_inicio}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& label': { color: '#FFFFFF' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#FF6347' },
              },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={hasFechaFin}
                onChange={(e) => setHasFechaFin(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FF6347',
                    '&:hover': { backgroundColor: 'rgba(255, 99, 71, 0.1)' },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#FF6347',
                  },
                }}
              />
            }
            label="Definir fecha de finalización"
            sx={{ color: '#FFFFFF' }}
          />

          {hasFechaFin && (
            <TextField
              label="Fecha de Fin"
              type="date"
              value={formData.fecha_fin}
              onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              error={!!errors.fecha_fin}
              helperText={errors.fecha_fin}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& label': { color: '#FFFFFF' },
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6347' },
                },
              }}
            />
          )}

          <TextField
            label="Descripción (opcional)"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            multiline
            rows={3}
            fullWidth
            sx={{
              '& label': { color: '#FFFFFF' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#FF6347' },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#FF1744',
            '&:hover': {
              backgroundColor: 'rgba(255, 23, 68, 0.1)',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#FF6347',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#FF4500',
            },
          }}
        >
          {egreso ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEgresoRecurrenteDialog;
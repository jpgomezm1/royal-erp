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

// Estado inicial de un pago puntual
const initialPaymentState = {
  fecha_pago: null,
  monto: '',
};

const CloseLeadDialog = ({ open, lead, onClose, onSave }) => {
  const [dealData, setDealData] = useState({
    // --- NUEVOS CAMPOS PARA LOS 5 PRODUCTOS ---
    indicador_rtc_pro_anual: false,
    indicador_rtc_pro_lifetime: false,
    club_privado_trimestral: false,
    club_privado_anual: false,
    instituto_royal: false,

    fecha_inicio_indicador_rtc_pro_anual: null,
    fecha_inicio_indicador_rtc_pro_lifetime: null,
    fecha_inicio_club_privado_trimestral: null,
    fecha_inicio_club_privado_anual: null,
    fecha_inicio_instituto_royal: null,

    // Método de pago y montos
    metodo_pago: '',
    monto_total: 0,
    pagos: [],
  });

  const [newPayment, setNewPayment] = useState(initialPaymentState);
  const [errors, setErrors] = useState({});

  // Calcula la suma total según los productos seleccionados
  const calculateTotalAmount = () => {
    let total = 0;
    if (dealData.indicador_rtc_pro_anual) total += 290;
    if (dealData.indicador_rtc_pro_lifetime) total += 990;
    if (dealData.club_privado_trimestral) total += 75;
    if (dealData.club_privado_anual) total += 270;
    if (dealData.instituto_royal) total += 3990;
    return total;
  };

  // Formatear fecha para mostrar en lista de pagos
  const formatDate = (dateTime) => {
    return dateTime.setLocale('es').toLocaleString(DateTime.DATE_FULL);
  };

  // Añadir un pago programado a la lista
  const handleAddPayment = () => {
    if (!newPayment.fecha_pago || !newPayment.monto) return;

    setDealData({
      ...dealData,
      pagos: [...dealData.pagos, { ...newPayment }],
    });
    setNewPayment(initialPaymentState);
  };

  // Eliminar un pago programado de la lista
  const handleRemovePayment = (index) => {
    setDealData({
      ...dealData,
      pagos: dealData.pagos.filter((_, i) => i !== index),
    });
  };

  // Validaciones antes de cerrar el Lead
  const validateForm = () => {
    const newErrors = {};

    // Al menos 1 producto
    const anyProductSelected =
      dealData.indicador_rtc_pro_anual ||
      dealData.indicador_rtc_pro_lifetime ||
      dealData.club_privado_trimestral ||
      dealData.club_privado_anual ||
      dealData.instituto_royal;

    if (!anyProductSelected) {
      newErrors.products = 'Selecciona al menos un producto';
    }

    // Validar fecha de inicio para cada producto seleccionado
    if (dealData.indicador_rtc_pro_anual && !dealData.fecha_inicio_indicador_rtc_pro_anual) {
      newErrors.fecha_inicio_indicador_rtc_pro_anual = 'Selecciona la fecha de inicio (Anual)';
    }
    if (dealData.indicador_rtc_pro_lifetime && !dealData.fecha_inicio_indicador_rtc_pro_lifetime) {
      newErrors.fecha_inicio_indicador_rtc_pro_lifetime = 'Selecciona la fecha de inicio (Lifetime)';
    }
    if (dealData.club_privado_trimestral && !dealData.fecha_inicio_club_privado_trimestral) {
      newErrors.fecha_inicio_club_privado_trimestral = 'Selecciona la fecha de inicio (Trimestral)';
    }
    if (dealData.club_privado_anual && !dealData.fecha_inicio_club_privado_anual) {
      newErrors.fecha_inicio_club_privado_anual = 'Selecciona la fecha de inicio (Anual)';
    }
    if (dealData.instituto_royal && !dealData.fecha_inicio_instituto_royal) {
      newErrors.fecha_inicio_instituto_royal = 'Selecciona la fecha de inicio para Instituto Royal';
    }

    // Método de pago
    if (!dealData.metodo_pago) {
      newErrors.metodo_pago = 'Selecciona un método de pago';
    }

    // Pagos
    if (dealData.pagos.length === 0) {
      newErrors.pagos = 'Agrega al menos un pago programado';
    }

    // Verificar que la suma de los pagos sea igual al total esperado
    const totalPayments = dealData.pagos.reduce((sum, p) => sum + Number(p.monto), 0);
    const expectedTotal = calculateTotalAmount();
    if (totalPayments !== expectedTotal) {
      newErrors.pagos = `El total de pagos (${totalPayments}) debe ser igual a $${expectedTotal}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Acción final al dar clic en "Cerrar Lead"
  const handleSubmit = async () => {
    if (validateForm()) {
      const formattedData = {
        ...dealData,
        // Convertir fechas a ISO
        fecha_inicio_indicador_rtc_pro_anual:
          dealData.fecha_inicio_indicador_rtc_pro_anual?.toISO() || null,
        fecha_inicio_indicador_rtc_pro_lifetime:
          dealData.fecha_inicio_indicador_rtc_pro_lifetime?.toISO() || null,
        fecha_inicio_club_privado_trimestral:
          dealData.fecha_inicio_club_privado_trimestral?.toISO() || null,
        fecha_inicio_club_privado_anual:
          dealData.fecha_inicio_club_privado_anual?.toISO() || null,
        fecha_inicio_instituto_royal:
          dealData.fecha_inicio_instituto_royal?.toISO() || null,

        monto_total: calculateTotalAmount(),
        pagos: dealData.pagos.map((p) => ({
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
          },
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
            {/* Sección de Productos */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Productos
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {/* Indicador RTC Pro (Licencia Anual) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.indicador_rtc_pro_anual}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            indicador_rtc_pro_anual: !prev.indicador_rtc_pro_anual,
                            fecha_inicio_indicador_rtc_pro_anual: !prev.indicador_rtc_pro_anual
                              ? null
                              : prev.fecha_inicio_indicador_rtc_pro_anual,
                          }))
                        }
                        sx={{
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          },
                        }}
                      />
                    }
                    label="Indicador RTC Pro (Anual) - $290"
                  />
                  {dealData.indicador_rtc_pro_anual && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_indicador_rtc_pro_anual}
                      onChange={(date) =>
                        setDealData({
                          ...dealData,
                          fecha_inicio_indicador_rtc_pro_anual: date,
                        })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_indicador_rtc_pro_anual,
                          helperText: errors.fecha_inicio_indicador_rtc_pro_anual,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                              },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Indicador RTC Pro (Licencia Lifetime) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.indicador_rtc_pro_lifetime}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            indicador_rtc_pro_lifetime: !prev.indicador_rtc_pro_lifetime,
                            fecha_inicio_indicador_rtc_pro_lifetime: !prev.indicador_rtc_pro_lifetime
                              ? null
                              : prev.fecha_inicio_indicador_rtc_pro_lifetime,
                          }))
                        }
                        sx={{
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          },
                        }}
                      />
                    }
                    label="Indicador RTC Pro (Lifetime) - $990"
                  />
                  {dealData.indicador_rtc_pro_lifetime && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_indicador_rtc_pro_lifetime}
                      onChange={(date) =>
                        setDealData({
                          ...dealData,
                          fecha_inicio_indicador_rtc_pro_lifetime: date,
                        })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_indicador_rtc_pro_lifetime,
                          helperText: errors.fecha_inicio_indicador_rtc_pro_lifetime,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                              },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Club Privado (Plan Trimestral) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.club_privado_trimestral}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            club_privado_trimestral: !prev.club_privado_trimestral,
                            fecha_inicio_club_privado_trimestral: !prev.club_privado_trimestral
                              ? null
                              : prev.fecha_inicio_club_privado_trimestral,
                          }))
                        }
                        sx={{
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          },
                        }}
                      />
                    }
                    label="Club Privado (Trimestral) - $75"
                  />
                  {dealData.club_privado_trimestral && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_club_privado_trimestral}
                      onChange={(date) =>
                        setDealData({
                          ...dealData,
                          fecha_inicio_club_privado_trimestral: date,
                        })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_club_privado_trimestral,
                          helperText: errors.fecha_inicio_club_privado_trimestral,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                              },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Club Privado (Plan Anual) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.club_privado_anual}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            club_privado_anual: !prev.club_privado_anual,
                            fecha_inicio_club_privado_anual: !prev.club_privado_anual
                              ? null
                              : prev.fecha_inicio_club_privado_anual,
                          }))
                        }
                        sx={{
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          },
                        }}
                      />
                    }
                    label="Club Privado (Anual) - $270"
                  />
                  {dealData.club_privado_anual && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_club_privado_anual}
                      onChange={(date) =>
                        setDealData({
                          ...dealData,
                          fecha_inicio_club_privado_anual: date,
                        })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_club_privado_anual,
                          helperText: errors.fecha_inicio_club_privado_anual,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                              },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Instituto Royal */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.instituto_royal}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            instituto_royal: !prev.instituto_royal,
                            fecha_inicio_instituto_royal: !prev.instituto_royal
                              ? null
                              : prev.fecha_inicio_instituto_royal,
                          }))
                        }
                        sx={{
                          color: '#00FFD1',
                          '&.Mui-checked': {
                            color: '#00FFD1',
                          },
                        }}
                      />
                    }
                    label="Instituto Royal ($3990)"
                  />
                  {dealData.instituto_royal && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_instituto_royal}
                      onChange={(date) =>
                        setDealData({
                          ...dealData,
                          fecha_inicio_instituto_royal: date,
                        })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_instituto_royal,
                          helperText: errors.fecha_inicio_instituto_royal,
                          sx: {
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                              '&:hover fieldset': { borderColor: '#FFFFFF' },
                              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
              {errors.products && (
                <Typography color="error" variant="caption">
                  {errors.products}
                </Typography>
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
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                }}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.metodo_pago && (
                <Typography color="error" variant="caption">
                  {errors.metodo_pago}
                </Typography>
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
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                        },
                      },
                    },
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
                    },
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
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Typography sx={{ color: '#FFFFFF' }}>
                    {formatDate(pago.fecha_pago)}
                  </Typography>
                  <Chip
                    label={`$${pago.monto}`}
                    sx={{
                      backgroundColor: '#00FFD1',
                      color: '#1E1E1E',
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
                <Typography color="error" variant="caption">
                  {errors.pagos}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: '#FFFFFF' }}>
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

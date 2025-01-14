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
    // --- Campos para los 5 productos ---
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

    // Método de pago y lista de pagos
    metodo_pago: '',
    pagos: [],

    // NUEVO: Campo para precio personalizado (string)
    monto_personalizado: '',
  });

  const [newPayment, setNewPayment] = useState(initialPaymentState);
  const [errors, setErrors] = useState({});

  // Calcula el precio base sumando los productos seleccionados
  const calculateBasePrice = () => {
    let total = 0;
    if (dealData.indicador_rtc_pro_anual) total += 290;
    if (dealData.indicador_rtc_pro_lifetime) total += 990;
    if (dealData.club_privado_trimestral) total += 75;
    if (dealData.club_privado_anual) total += 270;
    if (dealData.instituto_royal) total += 3990;
    return total;
  };

  // Devuelve el monto final que se usará en el deal (base o personalizado)
  const getFinalDealAmount = () => {
    const basePrice = calculateBasePrice();
    if (dealData.monto_personalizado.trim()) {
      const custom = parseFloat(dealData.monto_personalizado);
      if (!isNaN(custom) && custom > 0) {
        return custom;
      }
    }
    return basePrice;
  };

  // Formatear fecha para mostrar en la lista de pagos
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

  // Eliminar un pago programado
  const handleRemovePayment = (index) => {
    setDealData({
      ...dealData,
      pagos: dealData.pagos.filter((_, i) => i !== index),
    });
  };

  // Validaciones previas a enviar
  const validateForm = () => {
    const newErrors = {};

    // Al menos un producto seleccionado
    const anyProductSelected =
      dealData.indicador_rtc_pro_anual ||
      dealData.indicador_rtc_pro_lifetime ||
      dealData.club_privado_trimestral ||
      dealData.club_privado_anual ||
      dealData.instituto_royal;

    if (!anyProductSelected) {
      newErrors.products = 'Selecciona al menos un producto';
    }

    // Fechas de inicio según producto
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
      newErrors.fecha_inicio_instituto_royal = 'Selecciona la fecha de inicio (Instituto Royal)';
    }

    // Método de pago obligatorio
    if (!dealData.metodo_pago) {
      newErrors.metodo_pago = 'Selecciona un método de pago';
    }

    // Al menos un pago
    if (dealData.pagos.length === 0) {
      newErrors.pagos = 'Agrega al menos un pago programado';
    }

    // Verificar que la suma de los pagos sea igual al monto final (base o custom)
    const totalPayments = dealData.pagos.reduce((sum, p) => sum + Number(p.monto), 0);
    const finalAmount = getFinalDealAmount();

    if (Math.abs(totalPayments - finalAmount) > 0.0001) {
      newErrors.pagos = `El total de pagos ($${totalPayments}) debe ser igual a $${finalAmount}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Al dar clic en "Cerrar Lead"
  const handleSubmit = async () => {
    if (validateForm()) {
      const finalAmount = getFinalDealAmount();

      // Armamos el payload para crear el deal
      const formattedData = {
        ...dealData,
        // Convertir las fechas a ISO
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

        // Este será el monto final, sea base o custom.
        monto_total: finalAmount,

        // Pagos con fechas en ISO
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
                        setDealData({ ...dealData, fecha_inicio_indicador_rtc_pro_anual: date })
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
                        setDealData({ ...dealData, fecha_inicio_indicador_rtc_pro_lifetime: date })
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
                        setDealData({ ...dealData, fecha_inicio_club_privado_trimestral: date })
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
                        setDealData({ ...dealData, fecha_inicio_club_privado_anual: date })
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
                        setDealData({ ...dealData, fecha_inicio_instituto_royal: date })
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

            {/* NUEVO CAMPO: Monto personalizado */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Precio base calculado: ${calculateBasePrice()}
              </Typography>
              <TextField
                label="Precio personalizado (opcional)"
                type="number"
                value={dealData.monto_personalizado}
                onChange={(e) => setDealData({ ...dealData, monto_personalizado: e.target.value })}
                inputProps={{ min: 0 }}
                sx={{
                  '& label': { color: '#FFFFFF' },
                  '& label.Mui-focused': { color: '#00FFD1' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                  },
                  mb: 2,
                }}
                helperText="Si lo dejas en blanco, se usará el precio base. Si ingresas un valor, sobrescribirá el precio total."
              />
            </Box>

            {/* Pagos programados */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Pagos programados (Total: ${getFinalDealAmount()})
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

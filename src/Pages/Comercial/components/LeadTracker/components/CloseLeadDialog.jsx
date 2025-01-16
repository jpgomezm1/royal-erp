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
    // --- Campos para los productos renombrados ---
    indicador_rtc_anual: false,
    indicador_rtc_lifetime: false,
    sala_analisis_trimestral: false,
    sala_analisis_anual: false,
    mentorias: false,
    masterclass: false,

    fecha_inicio_indicador_rtc_anual: null,
    fecha_inicio_indicador_rtc_lifetime: null,
    fecha_inicio_sala_analisis_trimestral: null,
    fecha_inicio_sala_analisis_anual: null,
    fecha_inicio_mentorias: null,
    fecha_inicio_masterclass: null,

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
    if (dealData.indicador_rtc_anual) total += 290;
    if (dealData.indicador_rtc_lifetime) total += 990;
    if (dealData.sala_analisis_trimestral) total += 75;
    if (dealData.sala_analisis_anual) total += 270;
    if (dealData.mentorias) total += 3990;
    if (dealData.masterclass) total += 1164;
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
      dealData.indicador_rtc_anual ||
      dealData.indicador_rtc_lifetime ||
      dealData.sala_analisis_trimestral ||
      dealData.sala_analisis_anual ||
      dealData.mentorias ||
      dealData.masterclass;

    if (!anyProductSelected) {
      newErrors.products = 'Selecciona al menos un producto';
    }

    // Fechas de inicio según producto
    if (dealData.indicador_rtc_anual && !dealData.fecha_inicio_indicador_rtc_anual) {
      newErrors.fecha_inicio_indicador_rtc_anual = 'Selecciona la fecha de inicio (Licencia Anual)';
    }
    if (dealData.indicador_rtc_lifetime && !dealData.fecha_inicio_indicador_rtc_lifetime) {
      newErrors.fecha_inicio_indicador_rtc_lifetime = 'Selecciona la fecha de inicio (Lifetime)';
    }
    if (dealData.sala_analisis_trimestral && !dealData.fecha_inicio_sala_analisis_trimestral) {
      newErrors.fecha_inicio_sala_analisis_trimestral = 'Selecciona la fecha de inicio (Plan Trimestral)';
    }
    if (dealData.sala_analisis_anual && !dealData.fecha_inicio_sala_analisis_anual) {
      newErrors.fecha_inicio_sala_analisis_anual = 'Selecciona la fecha de inicio (Plan Anual)';
    }
    if (dealData.mentorias && !dealData.fecha_inicio_mentorias) {
      newErrors.fecha_inicio_mentorias = 'Selecciona la fecha de inicio (Mentorias)';
    }
    if (dealData.masterclass && !dealData.fecha_inicio_masterclass) {
      newErrors.fecha_inicio_masterclass = 'Selecciona la fecha de inicio (Masterclass)';
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
        fecha_inicio_indicador_rtc_anual:
          dealData.fecha_inicio_indicador_rtc_anual?.toISO() || null,
        fecha_inicio_indicador_rtc_lifetime:
          dealData.fecha_inicio_indicador_rtc_lifetime?.toISO() || null,
        fecha_inicio_sala_analisis_trimestral:
          dealData.fecha_inicio_sala_analisis_trimestral?.toISO() || null,
        fecha_inicio_sala_analisis_anual:
          dealData.fecha_inicio_sala_analisis_anual?.toISO() || null,
        fecha_inicio_mentorias:
          dealData.fecha_inicio_mentorias?.toISO() || null,
        fecha_inicio_masterclass:
          dealData.fecha_inicio_masterclass?.toISO() || null,

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
                {/* Indicador RTC (Licencia Anual) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.indicador_rtc_anual}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            indicador_rtc_anual: !prev.indicador_rtc_anual,
                            fecha_inicio_indicador_rtc_anual: !prev.indicador_rtc_anual
                              ? null
                              : prev.fecha_inicio_indicador_rtc_anual,
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
                    label="Indicador RTC (Licencia Anual) - $290"
                  />
                  {dealData.indicador_rtc_anual && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_indicador_rtc_anual}
                      onChange={(date) =>
                        setDealData({ ...dealData, fecha_inicio_indicador_rtc_anual: date })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_indicador_rtc_anual,
                          helperText: errors.fecha_inicio_indicador_rtc_anual,
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

                {/* Indicador RTC (Licencia Lifetime) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.indicador_rtc_lifetime}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            indicador_rtc_lifetime: !prev.indicador_rtc_lifetime,
                            fecha_inicio_indicador_rtc_lifetime: !prev.indicador_rtc_lifetime
                              ? null
                              : prev.fecha_inicio_indicador_rtc_lifetime,
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
                    label="Indicador RTC (Licencia Lifetime) - $990"
                  />
                  {dealData.indicador_rtc_lifetime && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_indicador_rtc_lifetime}
                      onChange={(date) =>
                        setDealData({ ...dealData, fecha_inicio_indicador_rtc_lifetime: date })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_indicador_rtc_lifetime,
                          helperText: errors.fecha_inicio_indicador_rtc_lifetime,
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

                {/* Sala de Analisis (Plan Trimestral) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.sala_analisis_trimestral}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            sala_analisis_trimestral: !prev.sala_analisis_trimestral,
                            fecha_inicio_sala_analisis_trimestral: !prev.sala_analisis_trimestral
                              ? null
                              : prev.fecha_inicio_sala_analisis_trimestral,
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
                    label="Sala de Analisis (Plan Trimestral) - $75"
                  />
                  {dealData.sala_analisis_trimestral && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_sala_analisis_trimestral}
                      onChange={(date) =>
                        setDealData({ ...dealData, fecha_inicio_sala_analisis_trimestral: date })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_sala_analisis_trimestral,
                          helperText: errors.fecha_inicio_sala_analisis_trimestral,
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

                {/* Sala de Analisis (Plan Anual) */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.sala_analisis_anual}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            sala_analisis_anual: !prev.sala_analisis_anual,
                            fecha_inicio_sala_analisis_anual: !prev.sala_analisis_anual
                              ? null
                              : prev.fecha_inicio_sala_analisis_anual,
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
                    label="Sala de Analisis (Plan Anual) - $270"
                  />
                  {dealData.sala_analisis_anual && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_sala_analisis_anual}
                      onChange={(date) =>
                        setDealData({ ...dealData, fecha_inicio_sala_analisis_anual: date })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_sala_analisis_anual,
                          helperText: errors.fecha_inicio_sala_analisis_anual,
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

                {/* Mentorias */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.mentorias}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            mentorias: !prev.mentorias,
                            fecha_inicio_mentorias: !prev.mentorias
                              ? null
                              : prev.fecha_inicio_mentorias,
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
                    label="Mentorias - $3990"
                  />
                  {dealData.mentorias && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_mentorias}
                      onChange={(date) =>
                        setDealData({ ...dealData, fecha_inicio_mentorias: date })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_mentorias,
                          helperText: errors.fecha_inicio_mentorias,
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

                {/* Masterclass */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dealData.masterclass}
                        onChange={() =>
                          setDealData((prev) => ({
                            ...prev,
                            masterclass: !prev.masterclass,
                            fecha_inicio_masterclass: !prev.masterclass
                              ? null
                              : prev.fecha_inicio_masterclass,
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
                    label="Masterclass - $1164"
                  />
                  {dealData.masterclass && (
                    <DatePicker
                      label="Fecha de inicio"
                      value={dealData.fecha_inicio_masterclass}
                      onChange={(date) =>
                        setDealData({ ...dealData, fecha_inicio_masterclass: date })
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.fecha_inicio_masterclass,
                          helperText: errors.fecha_inicio_masterclass,
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

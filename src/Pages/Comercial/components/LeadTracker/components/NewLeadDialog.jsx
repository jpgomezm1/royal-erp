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
  Chip,
  OutlinedInput,
  Typography
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Source as SourceIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';  // Usamos Luxon directamente

import { leadSources, countries, interestOptionsWithPrices } from '../leadConstants';

// Objeto para guardar los indicativos telefónicos por país
const countryPhoneCodes = {
  Argentina: '+54',
  Bolivia: '+591',
  Chile: '+56',
  Colombia: '+57',
  'Costa Rica': '+506',
  Ecuador: '+593',
  'El Salvador': '+503',
  España: '+34',
  Guatemala: '+502',
  Honduras: '+504',
  México: '+52',
  Nicaragua: '+505',
  Panamá: '+507',
  Paraguay: '+595',
  Perú: '+51',
  'República Dominicana': '+1',
  Uruguay: '+598',
  Venezuela: '+58'
  // "Otro": podría estar vacío o ser genérico
};

const initialLeadState = {
  nombre: '',
  telefono: '',
  email: '',
  pais: '',
  fuente: '',
  interes: [],
  notas: '',
  stage: 'LEAD',

  // Campo adicional para almacenar la fecha del primer contacto
  firstContact: null  // Si es null, se usará la fecha actual en el backend
};

const NewLeadDialog = ({ open, onClose, onSave }) => {
  const [leadData, setLeadData] = useState(initialLeadState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    if (!leadData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!leadData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!leadData.email.trim()) newErrors.email = 'El email es requerido';
    if (!leadData.pais) newErrors.pais = 'El país es requerido';
    if (!leadData.fuente) newErrors.fuente = 'La fuente es requerida';
    if (leadData.interes.length === 0) {
      newErrors.interes = 'Selecciona al menos un producto';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (leadData.email && !emailRegex.test(leadData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de envío
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Concatenar indicativo
        const prefix = countryPhoneCodes[leadData.pais] || '';
        const phoneClean = leadData.telefono.replace(/\D/g, '');
        const phoneWithCode = prefix + phoneClean;

        // Convertir la fecha a ISO si el usuario la eligió, si no -> null
        const firstContactDate = leadData.firstContact
          ? leadData.firstContact.toISO()  // Ej: "2025-01-15T00:00:00.000Z"
          : null;

        const formattedData = {
          ...leadData,
          telefono: phoneWithCode,
          first_contact_date: firstContactDate, // Se enviará al backend
          created_at: new Date().toISOString()
        };

        await onSave(formattedData);
        handleClose();
      } catch (error) {
        console.error('Error al guardar lead:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Manejo de cierre
  const handleClose = () => {
    setLeadData(initialLeadState);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Manejo del cambio en el campo de fecha (type="date")
  const handleDateChange = (e) => {
    const newDateString = e.target.value; // Formato "YYYY-MM-DD"
    // Parseamos con Luxon
    const dt = DateTime.fromFormat(newDateString, 'yyyy-MM-dd');
    if (dt.isValid) {
      // Si es válida, guardamos un objeto DateTime
      setLeadData({ ...leadData, firstContact: dt });
    } else {
      // Si es inválida o el usuario limpió, lo ponemos en null
      setLeadData({ ...leadData, firstContact: null });
    }
  };

  // Convertimos el valor DateTime a YYYY-MM-DD para el input
  const dateValue = leadData.firstContact
    ? leadData.firstContact.toFormat('yyyy-LL-dd')
    : '';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ color: '#00FFD1' }} />
          <Typography>Nuevo Lead</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: 2
          }}
        >
          {/* Nombre completo */}
          <TextField
            label="Nombre completo"
            value={leadData.nombre}
            onChange={(e) => setLeadData({ ...leadData, nombre: e.target.value })}
            error={!!errors.nombre}
            helperText={errors.nombre}
            disabled={isSubmitting}
            InputProps={{
              sx: { color: '#FFFFFF' }
            }}
            sx={{
              '& label': { color: '#FFFFFF' },
              '& label.Mui-focused': { color: '#00FFD1' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
              },
            }}
          />

          {/* Teléfono */}
          <TextField
            label="Teléfono"
            value={leadData.telefono}
            onChange={(e) => setLeadData({ ...leadData, telefono: e.target.value })}
            error={!!errors.telefono}
            helperText={errors.telefono}
            disabled={isSubmitting}
            InputProps={{
              sx: { color: '#FFFFFF' },
              startAdornment: <PhoneIcon sx={{ mr: 1, color: '#00FFD1' }} />,
            }}
            sx={{
              '& label': { color: '#FFFFFF' },
              '& label.Mui-focused': { color: '#00FFD1' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
              },
            }}
          />

          {/* Email */}
          <TextField
            label="Email"
            value={leadData.email}
            onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isSubmitting}
            InputProps={{
              sx: { color: '#FFFFFF' },
              startAdornment: <EmailIcon sx={{ mr: 1, color: '#00FFD1' }} />,
            }}
            sx={{
              '& label': { color: '#FFFFFF' },
              '& label.Mui-focused': { color: '#00FFD1' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
              },
            }}
          />

          {/* País */}
          <FormControl error={!!errors.pais} disabled={isSubmitting}>
            <InputLabel sx={{ color: '#FFFFFF' }}>País</InputLabel>
            <Select
              value={leadData.pais}
              onChange={(e) => setLeadData({ ...leadData, pais: e.target.value })}
              startAdornment={<PublicIcon sx={{ mr: 1, color: '#00FFD1' }} />}
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
              {countries.map((country) => (
                <MenuItem key={country} value={country}>{country}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fuente */}
          <FormControl error={!!errors.fuente} disabled={isSubmitting}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Fuente</InputLabel>
            <Select
              value={leadData.fuente}
              onChange={(e) => setLeadData({ ...leadData, fuente: e.target.value })}
              startAdornment={<SourceIcon sx={{ mr: 1, color: '#00FFD1' }} />}
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
              {leadSources.map((source) => (
                <MenuItem key={source} value={source}>{source}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fecha de primer contacto (opcional) */}
          <TextField
            label="Fecha primer contacto (opcional)"
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            disabled={isSubmitting}
            InputProps={{
              sx: { color: '#FFFFFF' }
            }}
            InputLabelProps={{
              shrink: true, // para que no se superponga el label
              sx: {
                color: '#FFFFFF',
                '&.Mui-focused': { color: '#00FFD1' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
              }
            }}
          />

          {/* Productos de interés */}
          <FormControl
            error={!!errors.interes}
            sx={{ gridColumn: '1 / -1' }}
            disabled={isSubmitting}
          >
            <InputLabel sx={{ color: '#FFFFFF' }}>Productos de interés</InputLabel>
            <Select
              multiple
              value={leadData.interes}
              onChange={(e) => setLeadData({ ...leadData, interes: e.target.value })}
              input={<OutlinedInput label="Productos de interés" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={`${value} (${interestOptionsWithPrices[value]} USD)`}
                      sx={{
                        backgroundColor: '#00FFD1',
                        color: '#1E1E1E'
                      }}
                    />
                  ))}
                </Box>
              )}
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
              {Object.keys(interestOptionsWithPrices).map((option) => (
                <MenuItem key={option} value={option}>
                  {option} ({interestOptionsWithPrices[option]} USD)
                </MenuItem>
              ))}
            </Select>
            {errors.interes && (
              <Typography color="error" variant="caption">{errors.interes}</Typography>
            )}
          </FormControl>

          {/* Notas */}
          <TextField
            label="Notas iniciales"
            multiline
            rows={4}
            value={leadData.notas}
            onChange={(e) => setLeadData({ ...leadData, notas: e.target.value })}
            disabled={isSubmitting}
            sx={{
              gridColumn: '1 / -1',
              '& label': { color: '#FFFFFF' },
              '& label.Mui-focused': { color: '#00FFD1' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          sx={{ color: '#FFFFFF' }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#00FFD1',
            color: '#1E1E1E',
            '&:hover': {
              backgroundColor: '#00CCB7',
            },
          }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewLeadDialog;

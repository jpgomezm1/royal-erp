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

import { leadSources, countries, interestOptionsWithPrices } from '../leadConstants';

const initialLeadState = {
  nombre: '',
  telefono: '',
  email: '',
  pais: '',
  fuente: '',
  interes: [],
  notas: '',
  stage: 'LEAD',
};

// 1) Mapa de códigos de país
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
  // "Otro": Podrías dejarlo vacío o poner un valor genérico
};

const NewLeadDialog = ({ open, onClose, onSave }) => {
  const [leadData, setLeadData] = useState(initialLeadState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validación antes de guardar
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

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (leadData.email && !emailRegex.test(leadData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // 2) Tomar el prefijo según el país y concatenar
        const prefix = countryPhoneCodes[leadData.pais] || '';
        // Eliminamos caracteres no numéricos para que quede limpio
        const phoneClean = leadData.telefono.replace(/\D/g, '');
        const phoneWithCode = prefix + phoneClean;

        const formattedData = {
          ...leadData,
          stage: 'LEAD',
          created_at: new Date().toISOString(),
          telefono: phoneWithCode
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

  const handleClose = () => {
    setLeadData(initialLeadState);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

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
        <Box sx={{ 
          display: 'grid', 
          gap: 2,
          gridTemplateColumns: 'repeat(2, 1fr)', 
          mt: 2 
        }}>
          {/* Nombre */}
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

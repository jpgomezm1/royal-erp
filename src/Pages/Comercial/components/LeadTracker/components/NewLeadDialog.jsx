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
import { leadSources, interestOptions, countries } from '../leadConstants';

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

const NewLeadDialog = ({ open, onClose, onSave }) => {
  const [leadData, setLeadData] = useState(initialLeadState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!leadData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!leadData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!leadData.email.trim()) newErrors.email = 'El email es requerido';
    if (!leadData.pais) newErrors.pais = 'El país es requerido';
    if (!leadData.fuente) newErrors.fuente = 'La fuente es requerida';
    if (leadData.interes.length === 0) newErrors.interes = 'Selecciona al menos un producto';

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (leadData.email && !emailRegex.test(leadData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const formattedData = {
          ...leadData,
          stage: 'LEAD',
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
          label={
            value === 'Club Privado' ? 'Club Privado (75 USD)' :
            value === 'Plan Anual' ? 'Plan Anual (270 USD)' :
            'Instituto Royal (2990 USD)' 
          }
          sx={{ 
            backgroundColor: '#00FFD1',
            color: '#1E1E1E'
          }}
        />
      ))}
    </Box>
  )}
>
  {interestOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option === 'Club Privado' ? 'Club Privado (75 USD)' :
       option === 'Plan Anual' ? 'Plan Anual (270 USD)' :
       'Instituto Royal (2990 USD)'}
    </MenuItem>
  ))}
</Select>

          </FormControl>

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
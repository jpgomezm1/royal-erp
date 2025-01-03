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
  Source as SourceIcon
} from '@mui/icons-material';
import { leadSources, interestOptions } from '../leadConstants';

const initialLeadState = {
  nombre: '',
  telefono: '',
  email: '',
  fuente: '',
  interes: [],
  presupuesto: '',
  notas: '',
  stage: 'LEAD',
  logs: [],
  reminders: []
};

const NewLeadDialog = ({ open, onClose, onSave }) => {
  const [leadData, setLeadData] = useState(initialLeadState);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!leadData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!leadData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!leadData.email.trim()) newErrors.email = 'El email es requerido';
    if (!leadData.fuente) newErrors.fuente = 'La fuente es requerida';
    if (leadData.interes.length === 0) newErrors.interes = 'Selecciona al menos un interés';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...leadData,
        createdAt: new Date().toISOString(),
      });
      setLeadData(initialLeadState);
      onClose();
    }
  };

  const handleClose = () => {
    setLeadData(initialLeadState);
    setErrors({});
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

          <FormControl error={!!errors.fuente}>
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

          <FormControl error={!!errors.interes} sx={{ gridColumn: '1 / -1' }}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Intereses</InputLabel>
            <Select
              multiple
              value={leadData.interes}
              onChange={(e) => setLeadData({ ...leadData, interes: e.target.value })}
              input={<OutlinedInput label="Intereses" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
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
              {interestOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Presupuesto estimado"
            value={leadData.presupuesto}
            onChange={(e) => setLeadData({ ...leadData, presupuesto: e.target.value })}
            type="number"
            InputProps={{
              sx: { color: '#FFFFFF' },
              startAdornment: <Box sx={{ color: '#00FFD1', mr: 1 }}>$</Box>,
            }}
            sx={{
              gridColumn: '1 / -1',
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
            label="Notas iniciales"
            multiline
            rows={4}
            value={leadData.notas}
            onChange={(e) => setLeadData({ ...leadData, notas: e.target.value })}
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
          Guardar Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewLeadDialog;
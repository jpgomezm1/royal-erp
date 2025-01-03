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
} from '@mui/material';
import { 
  History as HistoryIcon,
  ChatBubbleOutline as ChatIcon,
  Phone as CallIcon,
  Email as EmailIcon,
  Videocam as MeetingIcon,
  MoreHoriz as OtherIcon,
} from '@mui/icons-material';

const logTypes = {
  CHAT: { label: 'Chat', icon: ChatIcon },
  CALL: { label: 'Llamada', icon: CallIcon },
  EMAIL: { label: 'Email', icon: EmailIcon },
  MEETING: { label: 'Reunión', icon: MeetingIcon },
  OTHER: { label: 'Otro', icon: OtherIcon }
};

const initialLogState = {
  type: '',
  description: '',
  outcome: '',
  nextAction: '',
  reminderDate: ''
};

const LogDialog = ({ open, lead, onClose, onSave }) => {
  const [logData, setLogData] = useState(initialLogState);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!logData.type) newErrors.type = 'El tipo de interacción es requerido';
    if (!logData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!logData.outcome.trim()) newErrors.outcome = 'El resultado es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(lead.id, {
        ...logData,
        date: new Date().toISOString(),
        reminderDate: logData.reminderDate ? new Date(logData.reminderDate).toISOString() : null,
        id: Date.now()
      });
      setLogData(initialLogState);
    }
  };

  const handleClose = () => {
    setLogData(initialLogState);
    setErrors({});
    onClose();
  };

  const LogTypeIcon = logData.type ? logTypes[logData.type].icon : HistoryIcon;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LogTypeIcon sx={{ color: '#00FFD1' }} />
          <Box>
            <Typography variant="h6">Registrar Interacción</Typography>
            <Typography variant="subtitle2" sx={{ color: '#00FFD1' }}>
              {lead?.nombre}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ 
          display: 'grid', 
          gap: 2,
          gridTemplateColumns: 'repeat(2, 1fr)', 
          mt: 2 
        }}>
          <FormControl error={!!errors.type}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Tipo de interacción</InputLabel>
            <Select
              value={logData.type}
              onChange={(e) => setLogData({ ...logData, type: e.target.value })}
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
              {Object.entries(logTypes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <value.icon />
                    {value.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descripción"
            multiline
            rows={4}
            value={logData.description}
            onChange={(e) => setLogData({ ...logData, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
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

          <TextField
            label="Resultado de la interacción"
            value={logData.outcome}
            onChange={(e) => setLogData({ ...logData, outcome: e.target.value })}
            error={!!errors.outcome}
            helperText={errors.outcome}
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

          <TextField
            label="Próxima acción"
            value={logData.nextAction}
            onChange={(e) => setLogData({ ...logData, nextAction: e.target.value })}
            sx={{
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

          <TextField
            label="Recordatorio"
            type="datetime-local"
            value={logData.reminderDate}
            onChange={(e) => setLogData({ ...logData, reminderDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& label': { color: '#FFFFFF' },
              '& label.Mui-focused': { color: '#00FFD1' },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: '#FFFFFF' },
                '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                '& input': {
                  color: '#FFFFFF'
                }
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
          Guardar Interacción
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogDialog;
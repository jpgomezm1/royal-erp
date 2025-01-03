import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DateTime } from 'luxon';

const pipelineSteps = [
  'Lead Ingresado',
  'Contactado',
  'Interesado',
  'Propuesta',
  'Matriculado'
];

const LeadDetails = ({ lead, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      STUDENT: '#00FFD1',
      LEAD: '#FFC107',
      CONTACTED: '#2196F3',
      INTERESTED: '#9C27B0',
      ENROLLED: '#4CAF50',
      LOST: '#F44336',
    };
    return colors[status] || '#AAAAAA';
  };

  const getCurrentStep = () => {
    const stepMapping = {
      LEAD: 0,
      CONTACTED: 1,
      INTERESTED: 2,
      PROPOSAL: 3,
      ENROLLED: 4,
      STUDENT: 4,
    };
    return stepMapping[lead.status] || 0;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56,
              bgcolor: lead.status === 'STUDENT' ? '#00FFD1' : '#2C2C2C',
              color: lead.status === 'STUDENT' ? '#1E1E1E' : '#FFFFFF',
              border: '2px solid #00FFD1'
            }}
          >
            {lead.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
              {lead.nombre}
            </Typography>
            <Chip
              icon={lead.status === 'STUDENT' ? <SchoolIcon /> : <PersonIcon />}
              label={lead.status === 'STUDENT' ? 'Estudiante Activo' : 'Lead'}
              size="small"
              sx={{
                backgroundColor: `${getStatusColor(lead.status)}20`,
                color: getStatusColor(lead.status),
                mt: 0.5
              }}
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#FFFFFF' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contact Info */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#262626' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: '#00FFD1' }} />
              <Box>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  Email
                </Typography>
                <Typography sx={{ color: '#FFFFFF' }}>
                  {lead.email}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ color: '#00FFD1' }} />
              <Box>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  Teléfono
                </Typography>
                <Typography sx={{ color: '#FFFFFF' }}>
                  {lead.telefono}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              startIcon={<WhatsAppIcon />}
              fullWidth
              sx={{
                color: '#00FFD1',
                borderColor: '#00FFD1',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.1)',
                }
              }}
              onClick={() => window.open(`https://wa.me/${lead.telefono.replace(/\D/g, '')}`)}
            >
              Contactar por WhatsApp
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Pipeline Progress */}
      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
        Progreso en Pipeline
      </Typography>
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#262626' }}>
        <Stepper activeStep={getCurrentStep()} alternativeLabel>
          {pipelineSteps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: '#AAAAAA',
                    '&.Mui-active': { color: '#00FFD1' },
                    '&.Mui-completed': { color: '#00FFD1' },
                  }
                }}
              >
                <Typography sx={{ color: '#FFFFFF' }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Contact History */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
          Historial de Contactos
        </Typography>
        {lead.contacts?.map((contact, index) => (
          <Paper 
            key={index}
            sx={{ 
              p: 2, 
              mb: 2, 
              backgroundColor: '#262626',
              border: '1px solid rgba(0, 255, 209, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Chip
                label={contact.type}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 255, 209, 0.1)',
                  color: '#00FFD1',
                }}
              />
              <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                {DateTime.fromISO(contact.date).toFormat('dd/MM/yyyy HH:mm')}
              </Typography>
            </Box>
            <Typography sx={{ color: '#FFFFFF', mb: 1 }}>
              {contact.description}
            </Typography>
            <Typography variant="body2" sx={{ color: '#00FFD1' }}>
              Resultado: {contact.outcome}
            </Typography>
          </Paper>
        ))}
      </Box>

      {lead.status === 'STUDENT' && (
        <Box>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
            Información de Matrícula
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: '#262626' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  Fecha de Matrícula
                </Typography>
                <Typography sx={{ color: '#FFFFFF' }}>
                  {DateTime.fromISO(lead.enrollmentDate).toFormat('dd/MM/yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  Programa
                </Typography>
                <Typography sx={{ color: '#FFFFFF' }}>
                  {lead.program}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  Total Pagado
                </Typography>
                <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                  ${lead.totalPaid?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default LeadDetails;
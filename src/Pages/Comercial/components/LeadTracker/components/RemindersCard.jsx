import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DateTime } from 'luxon';

const RemindersCard = ({ leads, onComplete }) => {
  const [expanded, setExpanded] = useState(true);

  const getAllReminders = () => {
    return leads.flatMap(lead => 
      lead.reminders.map(reminder => ({
        ...reminder,
        leadId: lead.id,
        leadName: lead.nombre
      }))
    ).filter(reminder => !reminder.completed)
     .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatReminderDate = (date) => {
    const dt = DateTime.fromISO(date);
    const now = DateTime.now();
    
    if (dt.hasSame(now, 'day')) {
      return `Hoy, ${dt.toFormat('HH:mm')}`;
    } 
    if (dt.hasSame(now.plus({ days: 1 }), 'day')) {
      return `Mañana, ${dt.toFormat('HH:mm')}`;
    }
    return dt.toFormat("d 'de' LLLL, HH:mm");
  };
  
  const getReminderStatus = (date) => {
    const dt = DateTime.fromISO(date);
    const now = DateTime.now();
  
    if (dt < now) {
      return {
        label: 'Vencido',
        color: '#F44336',
        bgColor: 'rgba(244, 67, 54, 0.1)'
      };
    }
    if (dt.hasSame(now, 'day')) {
      return {
        label: 'Hoy',
        color: '#00FFD1',
        bgColor: 'rgba(0, 255, 209, 0.1)'
      };
    }
    if (dt.hasSame(now.plus({ days: 1 }), 'day')) {
      return {
        label: 'Mañana',
        color: '#FFC107',
        bgColor: 'rgba(255, 193, 7, 0.1)'
      };
    }
    return {
      label: 'Próximo',
      color: '#90CAF9',
      bgColor: 'rgba(144, 202, 249, 0.1)'
    };
  };

  const reminders = getAllReminders();

  return (
    <Card sx={{ 
      backgroundColor: '#2C2C2C',
      mb: 3,
      border: '1px solid rgba(0, 255, 209, 0.1)'
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: expanded ? 2 : 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ color: '#00FFD1' }} />
            <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
              Recordatorios Pendientes
            </Typography>
            <Chip
              label={reminders.length}
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                color: '#00FFD1',
                ml: 1
              }}
            />
          </Box>
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s',
              color: '#00FFD1'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          {reminders.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {reminders.map((reminder) => {
                const status = getReminderStatus(reminder.date);
                return (
                  <Paper
                    key={reminder.id}
                    sx={{
                      p: 2,
                      backgroundColor: '#262626',
                      border: '1px solid rgba(0, 255, 209, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            backgroundColor: status.bgColor,
                            color: status.color,
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ color: '#AAAAAA', fontSize: '0.9rem' }} />
                          <Typography sx={{ color: '#FFFFFF' }}>
                            {formatReminderDate(reminder.date)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <PersonIcon sx={{ color: '#00FFD1', fontSize: '0.9rem' }} />
                        <Typography sx={{ color: '#FFFFFF' }}>
                          {reminder.leadName}
                        </Typography>
                      </Box>

                      <Typography sx={{ color: '#AAAAAA' }}>
                        {reminder.action}
                      </Typography>
                    </Box>

                    <Tooltip title="Marcar como completado">
                      <IconButton
                        onClick={() => onComplete(reminder.leadId, reminder.id)}
                        sx={{
                          color: '#00FFD1',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 255, 209, 0.1)'
                          }
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                color: '#AAAAAA'
              }}
            >
              <Typography>
                No hay recordatorios pendientes
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default RemindersCard;
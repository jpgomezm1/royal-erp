import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  Menu,
  MenuItem,
  Collapse
} from '@mui/material';
import {
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { pipelineStages } from '../leadConstants';

const LeadTable = ({ leads, onOpenLog, onUpdateStage }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [expandedRow, setExpandedRow] = React.useState(null);

  const handleMenuClick = (event, lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLead(null);
  };

  const handleStageChange = (newStage) => {
    onUpdateStage(selectedLead.id, newStage);
    handleMenuClose();
  };

  const toggleRowExpansion = (leadId) => {
    setExpandedRow(expandedRow === leadId ? null : leadId);
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: '#2C2C2C',
        mb: 3,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#FFFFFF' }}></TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Nombre</TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Contacto</TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Fuente</TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Intereses</TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Estado</TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Última actividad</TableCell>
            <TableCell sx={{ color: '#FFFFFF' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <React.Fragment key={lead.id}>
              <TableRow 
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 255, 209, 0.05)' 
                  }
                }}
              >
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleRowExpansion(lead.id)}
                    sx={{ color: '#00FFD1' }}
                  >
                    <ExpandMoreIcon 
                      sx={{ 
                        transform: expandedRow === lead.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }}
                    />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                    {lead.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Tooltip title={lead.telefono}>
                      <PhoneIcon sx={{ color: '#00FFD1', fontSize: 20 }} />
                    </Tooltip>
                    <Tooltip title={lead.email}>
                      <EmailIcon sx={{ color: '#00FFD1', fontSize: 20 }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.fuente}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0, 255, 209, 0.1)',
                      color: '#00FFD1',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {lead.interes.map((int) => (
                      <Chip
                        key={int}
                        label={int}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 255, 209, 0.1)',
                          color: '#00FFD1',
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={pipelineStages[lead.stage].label}
                    sx={{
                      backgroundColor: `${pipelineStages[lead.stage].color}20`,
                      color: pipelineStages[lead.stage].color,
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#FFFFFF' }}>
                  {lead.logs?.length > 0 
                    ? format(new Date(lead.logs[lead.logs.length - 1].date), "d 'de' MMMM, HH:mm", { locale: es })
                    : 'Sin actividad'
                  }
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Registrar actividad">
                      <IconButton 
                        onClick={() => onOpenLog(lead)}
                        sx={{ color: '#00FFD1' }}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Más acciones">
                      <IconButton 
                        onClick={(e) => handleMenuClick(e, lead)}
                        sx={{ color: '#00FFD1' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                  <Collapse in={expandedRow === lead.id} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 3, backgroundColor: '#262626' }}>
                      <Typography variant="h6" sx={{ color: '#00FFD1', mb: 2 }}>
                        Historial de actividades
                      </Typography>
                      {lead.logs?.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {lead.logs.map((log) => (
                            <Paper
                              key={log.id}
                              sx={{
                                p: 2,
                                backgroundColor: '#2C2C2C',
                                border: '1px solid rgba(0, 255, 209, 0.1)'
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ color: '#00FFD1' }}>
                                  {format(new Date(log.date), "d 'de' MMMM, HH:mm", { locale: es })}
                                </Typography>
                                <Chip 
                                  label={log.type} 
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(0, 255, 209, 0.1)',
                                    color: '#00FFD1',
                                  }}
                                />
                              </Box>
                              <Typography sx={{ color: '#FFFFFF' }}>
                                {log.description}
                              </Typography>
                              {log.nextAction && (
                                <Typography sx={{ color: '#AAAAAA', mt: 1, fontSize: '0.9rem' }}>
                                  Próxima acción: {log.nextAction}
                                </Typography>
                              )}
                            </Paper>
                          ))}
                        </Box>
                      ) : (
                        <Typography sx={{ color: '#AAAAAA' }}>
                          No hay actividades registradas
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2C2C2C',
            color: '#FFFFFF',
          }
        }}
      >
        <Typography sx={{ px: 2, py: 1, color: '#AAAAAA' }}>
          Cambiar estado
        </Typography>
        {Object.entries(pipelineStages).map(([key, value]) => (
          <MenuItem 
            key={key}
            onClick={() => handleStageChange(key)}
            sx={{
              color: value.color,
              '&:hover': {
                backgroundColor: `${value.color}20`
              }
            }}
          >
            {value.label}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
};

export default LeadTable;
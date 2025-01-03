import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  TablePagination,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { DateTime } from 'luxon';

const statusColors = {
  STUDENT: { color: '#00FFD1', label: 'Estudiante Activo' },
  LEAD: { color: '#FFC107', label: 'Lead Nuevo' },
  CONTACTED: { color: '#2196F3', label: 'Contactado' },
  INTERESTED: { color: '#9C27B0', label: 'Interesado' },
  ENROLLED: { color: '#4CAF50', label: 'Matriculado' },
  LOST: { color: '#F44336', label: 'Perdido' },
};

const LeadTable = ({ leads, onLeadClick, filters }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastContact = (date) => {
    return DateTime.fromISO(date).toRelative({ locale: 'es' });
  };

  const filterLeads = (leads) => {
    return leads.filter(lead => {
      if (filters.status !== 'all' && lead.status !== filters.status) return false;
      if (filters.source !== 'all' && lead.source !== filters.source) return false;
      // Agrega más filtros según necesites
      return true;
    });
  };

  const filteredLeads = filterLeads(leads);

  return (
    <>
      <TableContainer component={Paper} sx={{ backgroundColor: '#2C2C2C' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#FFFFFF' }}>Lead</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Estado</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Fuente</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Último Contacto</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Programa</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Valor</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lead) => (
                <TableRow 
                  key={lead.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 255, 209, 0.05)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: lead.status === 'STUDENT' ? '#00FFD1' : '#2C2C2C',
                          color: lead.status === 'STUDENT' ? '#1E1E1E' : '#FFFFFF',
                          border: '2px solid #00FFD1'
                        }}
                      >
                        {getInitials(lead.nombre)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#FFFFFF' }}>
                          {lead.nombre}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                          {lead.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={lead.status === 'STUDENT' ? <SchoolIcon /> : <CircleIcon sx={{ fontSize: '12px !important' }} />}
                      label={statusColors[lead.status].label}
                      sx={{
                        backgroundColor: `${statusColors[lead.status].color}20`,
                        color: statusColors[lead.status].color,
                        '& .MuiChip-icon': {
                          color: statusColors[lead.status].color
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.source}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 255, 209, 0.1)',
                        color: '#00FFD1',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon sx={{ color: '#AAAAAA', fontSize: '1rem' }} />
                      <Typography sx={{ color: '#FFFFFF' }}>
                        {formatLastContact(lead.lastContact)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {lead.program || 'No definido'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                      ${lead.totalPaid?.toLocaleString() || '0'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles">
                      <IconButton 
                        onClick={() => onLeadClick(lead)}
                        sx={{ color: '#00FFD1' }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={filteredLeads.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: '#FFFFFF',
          '.MuiTablePagination-select': {
            color: '#FFFFFF'
          },
          '.MuiTablePagination-selectIcon': {
            color: '#FFFFFF'
          }
        }}
      />
    </>
  );
};

export default LeadTable;
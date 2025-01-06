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
  LEAD:            { color: '#FFC107', label: 'Lead Potencial' },
  CLIENTE_INACTIVO:{ color: '#29B6F6', label: 'Cliente Inactivo' },
  CLIENTE_ACTIVO:  { color: '#4CAF50', label: 'Cliente Activo' },
  EX_CLIENTE:      { color: '#F44336', label: 'Ex Cliente' },
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

  const formatLastContact = (isoDate) => {
    if (!isoDate) return 'Sin actividad';
    return DateTime.fromISO(isoDate).toRelative({ locale: 'es' });
  };

  // Aquí filtramos en frontend (muy básico) por status y source
  const filterLeads = (leads) => {
    return leads.filter(lead => {
      // lead.crm_status => 'LEAD', 'CLIENTE_INACTIVO', etc.
      if (filters.status !== 'all' && lead.crm_status !== filters.status) return false;
      if (filters.source !== 'all' && lead.fuente !== filters.source) return false;
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
              <TableCell sx={{ color: '#FFFFFF' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Estado (CRM)</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Fuente</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>País</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Última Actividad</TableCell>
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
                          bgcolor: lead.crm_status === 'CLIENTE_ACTIVO' ? '#00FFD1' : '#2C2C2C',
                          color: lead.crm_status === 'CLIENTE_ACTIVO' ? '#1E1E1E' : '#FFFFFF',
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
                      icon={
                        lead.crm_status === 'CLIENTE_ACTIVO'
                          ? <SchoolIcon />
                          : <CircleIcon sx={{ fontSize: '12px !important' }} />
                      }
                      label={statusColors[lead.crm_status].label}
                      sx={{
                        backgroundColor: `${statusColors[lead.crm_status].color}20`,
                        color: statusColors[lead.crm_status].color,
                        '& .MuiChip-icon': {
                          color: statusColors[lead.crm_status].color
                        }
                      }}
                    />
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

                  {/* NUEVA COLUMNA: País */}
                  <TableCell>
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {lead.pais || 'N/D'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#FFFFFF' }}>
                        {formatLastContact(
                          lead.logs && lead.logs.length > 0
                            ? lead.logs[lead.logs.length - 1].date
                            : null
                        )}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {lead.deal ? 'Tiene Deal' : 'Sin Deal'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                      {lead.deal ? `$${lead.deal.monto_total || 0}` : '$0'}
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

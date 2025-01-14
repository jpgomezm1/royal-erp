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
  Circle as CircleIcon,
} from '@mui/icons-material';
import { DateTime } from 'luxon';

const statusColors = {
  LEAD:            { color: '#FFC107', label: 'Lead Potencial' },
  CLIENTE_INACTIVO:{ color: '#29B6F6', label: 'Cliente Inactivo' },
  CLIENTE_ACTIVO:  { color: '#4CAF50', label: 'Cliente Activo' },
  EX_CLIENTE:      { color: '#F44336', label: 'Ex Cliente' },
};

// Retorna una cadena con los planes que el lead tiene contratados.
const getProgramDescription = (lead) => {
  if (!lead.deal) return 'Sin Deal';

  const {
    indicador_rtc_pro_anual,
    indicador_rtc_pro_lifetime,
    club_privado_trimestral,
    club_privado_anual,
    instituto_royal
  } = lead.deal;

  const planNames = [];
  if (indicador_rtc_pro_anual) planNames.push('Indicador RTC Pro (Anual)');
  if (indicador_rtc_pro_lifetime) planNames.push('Indicador RTC Pro (Lifetime)');
  if (club_privado_trimestral) planNames.push('Club Privado (Trimestral)');
  if (club_privado_anual) planNames.push('Club Privado (Anual)');
  if (instituto_royal) planNames.push('Instituto Royal');

  return planNames.length ? planNames.join(', ') : 'Sin Plan';
};

// Suma todos los abonos (transactions) de todas las cuotas de un deal
const getTotalAbonado = (lead) => {
  if (!lead.deal || !lead.deal.pagos) return 0;
  let totalAbonos = 0;
  lead.deal.pagos.forEach((pago) => {
    const sumAbonos = pago.transactions?.reduce((acc, tx) => acc + tx.monto_abono, 0) || 0;
    totalAbonos += sumAbonos;
  });
  return totalAbonos;
};

// Calcula el saldo pendiente = monto_total - total abonado
const getSaldo = (lead) => {
  if (!lead.deal) return 0;
  const totalAbonado = getTotalAbonado(lead);
  return lead.deal.monto_total - totalAbonado;
};

// NUEVA FUNCIÓN: Renderiza chips con las fechas de pago
const renderPaymentDates = (lead) => {
  // Si no hay Deal o no hay pagos
  if (!lead.deal || !lead.deal.pagos || lead.deal.pagos.length === 0) {
    return 'N/A';
  }

  // Ordenamos los pagos por fecha ascendente
  const sorted = [...lead.deal.pagos].sort(
    (a, b) => new Date(a.fecha_pago) - new Date(b.fecha_pago)
  );

  // Tomamos solo los primeros 3
  const firstThree = sorted.slice(0, 3);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {firstThree.map((pago) => {
        const dateLabel = DateTime.fromISO(pago.fecha_pago).toFormat('dd/MM/yyyy');
        return (
          <Chip
            key={pago.id}
            label={dateLabel}
            sx={{
              backgroundColor: 'rgba(0, 255, 209, 0.1)',
              color: '#00FFD1'
            }}
          />
        );
      })}

      {/* Si hay más de 3 pagos, mostramos un chip final con "+X" */}
      {sorted.length > 3 && (
        <Chip
          label={`+${sorted.length - 3}`}
          sx={{
            backgroundColor: 'rgba(0, 255, 209, 0.1)',
            color: '#00FFD1'
          }}
        />
      )}
    </Box>
  );
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

  // Aquí filtramos en frontend (muy básico) por status y fuente
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
              <TableCell sx={{ color: '#FFFFFF' }}>Estado</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Fuente</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>País</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Programa</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Valor</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Pagado</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Saldo</TableCell>
              {/* NUEVA COLUMNA: FECHAS DE PAGO */}
              <TableCell sx={{ color: '#FFFFFF' }}>Fechas de Pago</TableCell>
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

                  <TableCell>
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {lead.pais || 'N/D'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {getProgramDescription(lead)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                      {lead.deal ? `$${lead.deal.monto_total || 0}` : '$0'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                      {lead.deal ? `$${getTotalAbonado(lead).toLocaleString()}` : '$0'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {lead.deal ? `$${getSaldo(lead).toLocaleString()}` : '$0'}
                    </Typography>
                  </TableCell>

                  {/* COLUMNA "FECHAS DE PAGO" */}
                  <TableCell>
                    {renderPaymentDates(lead)}
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

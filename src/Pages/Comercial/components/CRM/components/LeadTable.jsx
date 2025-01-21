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

// NUEVO: Lista de productos con sus keys y labels (igual que en LeadDetails)
const productList = [
  { key: 'indicador_rtc_anual', label: 'Indicador RTC (Licencia Anual)' },
  { key: 'indicador_rtc_lifetime', label: 'Indicador RTC (Licencia Lifetime)' },
  { key: 'sala_analisis_trimestral', label: 'Sala de Análisis (Plan Trimestral)' },
  { key: 'sala_analisis_anual', label: 'Sala de Análisis (Plan Anual)' },
  { key: 'mentorias', label: 'Mentorias' },
  { key: 'masterclass', label: 'Masterclass' },
];

// Suma todos los abonos de todas las cuotas
const getTotalAbonado = (lead) => {
  if (!lead.deal || !lead.deal.pagos) return 0;
  return lead.deal.pagos.reduce((acc, pago) => {
    const sum = pago.transactions?.reduce((a, tx) => a + tx.monto_abono, 0) || 0;
    return acc + sum;
  }, 0);
};

// Calcula el saldo pendiente = monto_total - totalAbonado
const getSaldo = (lead) => {
  if (!lead.deal) return 0;
  const totalAbonado = getTotalAbonado(lead);
  return lead.deal.monto_total - totalAbonado;
};

// Renderiza chips con las fechas de pago (limitado a 3)
const renderPaymentDates = (lead) => {
  if (!lead.deal || !lead.deal.pagos || lead.deal.pagos.length === 0) return 'N/A';
  const sorted = [...lead.deal.pagos].sort(
    (a, b) => new Date(a.fecha_pago) - new Date(b.fecha_pago)
  );
  const firstThree = sorted.slice(0, 3);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {firstThree.map((p) => {
        const dateLabel = DateTime.fromISO(p.fecha_pago).toFormat('dd/MM/yyyy');
        return (
          <Chip
            key={p.id}
            label={dateLabel}
            sx={{
              backgroundColor: 'rgba(0, 255, 209, 0.1)',
              color: '#00FFD1',
            }}
          />
        );
      })}
      {sorted.length > 3 && (
        <Chip
          label={`+${sorted.length - 3}`}
          sx={{
            backgroundColor: 'rgba(0, 255, 209, 0.1)',
            color: '#00FFD1',
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

  const getInitials = (name) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  // Filtrado por status/fuente si quieres, etc.:
  const filterLeads = (leads) => {
    return leads.filter((lead) => {
      // ...
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
              <TableCell sx={{ color: '#FFFFFF' }}>Fechas de Pago</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lead) => {
                // Calcula total abonado, saldo, etc.
                const totalAbonado = getTotalAbonado(lead);
                const saldo = getSaldo(lead);

                return (
                  <TableRow
                    key={lead.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 209, 0.05)',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {/* Nombre/Email */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              lead.crm_status === 'CLIENTE_ACTIVO'
                                ? '#00FFD1'
                                : '#2C2C2C',
                            color:
                              lead.crm_status === 'CLIENTE_ACTIVO'
                                ? '#1E1E1E'
                                : '#FFFFFF',
                            border: '2px solid #00FFD1',
                          }}
                        >
                          {getInitials(lead.nombre)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: '#FFFFFF' }}>{lead.nombre}</Typography>
                          <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                            {lead.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Chip
                        icon={
                          lead.crm_status === 'CLIENTE_ACTIVO' ? (
                            <SchoolIcon />
                          ) : (
                            <CircleIcon sx={{ fontSize: '12px !important' }} />
                          )
                        }
                        label={statusColors[lead.crm_status].label}
                        sx={{
                          backgroundColor: `${statusColors[lead.crm_status].color}20`,
                          color: statusColors[lead.crm_status].color,
                          '& .MuiChip-icon': {
                            color: statusColors[lead.crm_status].color,
                          },
                        }}
                      />
                    </TableCell>

                    {/* Fuente */}
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

                    {/* País */}
                    <TableCell>
                      <Typography sx={{ color: '#FFFFFF' }}>
                        {lead.pais || 'N/D'}
                      </Typography>
                    </TableCell>

                    {/* PROGRAMA: RENDERIZAMOS CHIPS */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {lead.deal
                          ? productList.map((product) => {
                              if (lead.deal[product.key]) {
                                return (
                                  <Chip
                                    key={product.key}
                                    label={product.label}
                                    sx={{
                                      backgroundColor: 'rgba(0,255,209,0.2)',
                                      color: '#00FFD1',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                );
                              }
                              return null;
                            })
                          : null}

                        {/* Si no hay deal o no tiene ninguno de esos productos => "Sin Plan" */}
                        {(!lead.deal ||
                          !productList.some((p) => lead.deal[p.key])) && (
                          <Typography sx={{ color: '#AAAAAA' }}>Sin Plan</Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Valor (monto_total) */}
                    <TableCell>
                      <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                        {lead.deal
                          ? `$${(lead.deal.monto_total || 0).toLocaleString()}`
                          : '$0'}
                      </Typography>
                    </TableCell>

                    {/* Pagado */}
                    <TableCell>
                      <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                        ${totalAbonado.toLocaleString()}
                      </Typography>
                    </TableCell>

                    {/* Saldo */}
                    <TableCell>
                      <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        ${saldo.toLocaleString()}
                      </Typography>
                    </TableCell>

                    {/* Fechas de Pago */}
                    <TableCell>{renderPaymentDates(lead)}</TableCell>

                    {/* Acciones */}
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
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
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
            color: '#FFFFFF',
          },
          '.MuiTablePagination-selectIcon': {
            color: '#FFFFFF',
          },
        }}
      />
    </>
  );
};

export default LeadTable;

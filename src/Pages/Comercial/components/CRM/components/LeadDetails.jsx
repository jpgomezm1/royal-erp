import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Avatar,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DateTime } from 'luxon';

import PartialPaymentDialog from './PartialPaymentDialog';

// ----------------------------------------------------------------
// Componente para renderizar el contenido de cada Tab
// ----------------------------------------------------------------
function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ mt: 3 }}>{children}</Box> : null;
}

// ----------------------------------------------------------------
// LeadDetails: Muestra la info del Lead, con Tabs para general y financiera
// ----------------------------------------------------------------
const LeadDetails = ({ lead, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Abre el diálogo de abono parcial
  const handleOpenAbonoDialog = (payment) => {
    setSelectedPayment(payment);
    setOpenDialog(true);
  };

  // Cierra el diálogo de abono parcial
  const handleCloseAbonoDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
  };

  // Lógica para guardar el abono, llamando al backend
  const handleSaveAbono = async (dataAbono) => {
    try {
      if (!lead.deal || !selectedPayment) return;

      const dealId = lead.deal.id;
      const paymentId = selectedPayment.id;
      // Ejemplo de URL: /api/deals/:deal_id/payment/:payment_id/abono
      const response = await fetch(`/api/deals/${dealId}/payment/${paymentId}/abono`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAbono)
      });
      if (!response.ok) throw new Error('Error al registrar abono');

      // Respuesta devuelta: Payment.to_dict() (con transacciones actualizadas)
      const updatedDealOrPayment = await response.json();
      console.log('Deal o Payment actualizado:', updatedDealOrPayment);

      // Aquí, idealmente, deberías actualizar el estado "lead" con la nueva info.
      // Ej: si el backend retornó el Payment actualizado, o el Deal completo
      // lead.deal = updatedDealOrPayment; // si retorna el deal
      // setLead({ ...lead }); // Forzar re-render

      handleCloseAbonoDialog();
    } catch (error) {
      console.error('Error abono parcial:', error);
    }
  };

  // Función para marcar la cuota como pagada en su totalidad (usa fecha actual)
  const handleMarkAsPaidInFull = async (pago) => {
    try {
      if (!lead.deal) return;
      const dealId = lead.deal.id;

      // Armamos un abono con el 100% del monto
      const dataAbono = {
        fecha_abono: new Date().toISOString(),
        monto_abono: parseFloat(pago.monto) // 100% de la cuota
      };

      const response = await fetch(`/api/deals/${dealId}/payment/${pago.id}/abono`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAbono)
      });
      if (!response.ok) throw new Error('Error al registrar pago total');

      const updatedDealOrPayment = await response.json();
      console.log('Pago marcado como completado:', updatedDealOrPayment);

      // Aquí también deberías refrescar el estado local si deseas
      // lead.deal = updatedDealOrPayment;
      // setLead({ ...lead });
    } catch (error) {
      console.error('Error marcando cuota como pagada en full:', error);
    }
  };

  const getCrmStatusColor = (crmStatus) => {
    const colors = {
      LEAD:            '#FFC107',
      CLIENTE_INACTIVO:'#29B6F6',
      CLIENTE_ACTIVO:  '#4CAF50',
      EX_CLIENTE:      '#F44336',
    };
    return colors[crmStatus] || '#AAAAAA';
  };

  const getCrmLabel = (crmStatus) => {
    const labels = {
      LEAD:            'Lead Potencial',
      CLIENTE_INACTIVO:'Cliente Inactivo',
      CLIENTE_ACTIVO:  'Cliente Activo',
      EX_CLIENTE:      'Ex Cliente',
    };
    return labels[crmStatus] || 'Desconocido';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Cálculo del progreso global (total abonos vs. monto_total)
  let totalAbonadoGlobal = 0;
  if (lead.deal && lead.deal.pagos) {
    totalAbonadoGlobal = lead.deal.pagos.reduce((acc, pago) => {
      const sumAbonos = pago.transactions?.reduce((a, tx) => a + tx.monto_abono, 0) || 0;
      return acc + sumAbonos;
    }, 0);
  }
  const avanceGlobal = lead.deal ? (totalAbonadoGlobal / lead.deal.monto_total) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56,
              bgcolor: lead.crm_status === 'CLIENTE_ACTIVO' ? '#00FFD1' : '#2C2C2C',
              color: lead.crm_status === 'CLIENTE_ACTIVO' ? '#1E1E1E' : '#FFFFFF',
              border: '2px solid #00FFD1'
            }}
          >
            {getInitials(lead.nombre)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
              {lead.nombre}
            </Typography>
            <Chip
              icon={lead.crm_status === 'CLIENTE_ACTIVO' ? <SchoolIcon /> : <PersonIcon />}
              label={getCrmLabel(lead.crm_status)}
              size="small"
              sx={{
                backgroundColor: `${getCrmStatusColor(lead.crm_status)}20`,
                color: getCrmStatusColor(lead.crm_status),
                mt: 0.5
              }}
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#FFFFFF' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiTab-root': {
            color: '#FFFFFF',
            textTransform: 'none',
          },
          '& .Mui-selected': {
            color: '#00FFD1',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#00FFD1'
          }
        }}
      >
        <Tab label="Información General" />
        <Tab label="Información Financiera" />
      </Tabs>

      {/* TAB 0: INFORMACIÓN GENERAL */}
      <TabPanel value={selectedTab} index={0}>
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

        {/* Detalles del Deal */}
        {lead.deal && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
              Detalles del Deal
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: '#262626', mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Método de Pago
                  </Typography>
                  <Typography sx={{ color: '#FFFFFF' }}>
                    {lead.deal.metodo_pago}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Monto Total
                  </Typography>
                  <Typography sx={{ color: '#00FFD1', fontWeight: 600 }}>
                    ${lead.deal.monto_total?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Fecha de Cierre
                  </Typography>
                  <Typography sx={{ color: '#FFFFFF' }}>
                    {DateTime.fromISO(lead.deal.fecha_cierre).toFormat('dd/MM/yyyy')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Productos Contratados (LOS 5 PRODUCTOS NUEVOS) */}
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 1 }}>
              Productos Contratados
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: '#262626' }}>
              {/* Indicador RTC Pro (Anual) */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#FFFFFF' }}>
                  Indicador RTC Pro (Anual):{' '}
                  {lead.deal.indicador_rtc_pro_anual ? 'Sí' : 'No'}
                </Typography>
                {lead.deal.indicador_rtc_pro_anual && lead.deal.fecha_inicio_indicador_rtc_pro_anual && (
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Inicio: {DateTime.fromISO(lead.deal.fecha_inicio_indicador_rtc_pro_anual).toFormat('dd/MM/yyyy')}
                  </Typography>
                )}
              </Box>

              {/* Indicador RTC Pro (Lifetime) */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#FFFFFF' }}>
                  Indicador RTC Pro (Lifetime):{' '}
                  {lead.deal.indicador_rtc_pro_lifetime ? 'Sí' : 'No'}
                </Typography>
                {lead.deal.indicador_rtc_pro_lifetime && lead.deal.fecha_inicio_indicador_rtc_pro_lifetime && (
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Inicio: {DateTime.fromISO(lead.deal.fecha_inicio_indicador_rtc_pro_lifetime).toFormat('dd/MM/yyyy')}
                  </Typography>
                )}
              </Box>

              {/* Club Privado (Trimestral) */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#FFFFFF' }}>
                  Club Privado (Trimestral):{' '}
                  {lead.deal.club_privado_trimestral ? 'Sí' : 'No'}
                </Typography>
                {lead.deal.club_privado_trimestral && lead.deal.fecha_inicio_club_privado_trimestral && (
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Inicio: {DateTime.fromISO(lead.deal.fecha_inicio_club_privado_trimestral).toFormat('dd/MM/yyyy')}
                  </Typography>
                )}
              </Box>

              {/* Club Privado (Anual) */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#FFFFFF' }}>
                  Club Privado (Anual):{' '}
                  {lead.deal.club_privado_anual ? 'Sí' : 'No'}
                </Typography>
                {lead.deal.club_privado_anual && lead.deal.fecha_inicio_club_privado_anual && (
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Inicio: {DateTime.fromISO(lead.deal.fecha_inicio_club_privado_anual).toFormat('dd/MM/yyyy')}
                  </Typography>
                )}
              </Box>

              {/* Instituto Royal */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#FFFFFF' }}>
                  Instituto Royal:{' '}
                  {lead.deal.instituto_royal ? 'Sí' : 'No'}
                </Typography>
                {lead.deal.instituto_royal && lead.deal.fecha_inicio_instituto_royal && (
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    Inicio: {DateTime.fromISO(lead.deal.fecha_inicio_instituto_royal).toFormat('dd/MM/yyyy')}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Historial de Logs */}
        <Box>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
            Historial de Actividades
          </Typography>
          {lead.logs && lead.logs.length > 0 ? (
            lead.logs.map((log) => (
              <Paper
                key={log.id}
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  backgroundColor: '#262626',
                  border: '1px solid rgba(0, 255, 209, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={log.type}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0, 255, 209, 0.1)',
                      color: '#00FFD1',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                    {DateTime.fromISO(log.date).toFormat('dd/MM/yyyy HH:mm')}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#FFFFFF', mb: 1 }}>
                  {log.description}
                </Typography>
                <Typography variant="body2" sx={{ color: '#00FFD1' }}>
                  Resultado: {log.outcome}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography sx={{ color: '#AAAAAA' }}>
              No hay actividades registradas.
            </Typography>
          )}
        </Box>
      </TabPanel>

      {/* TAB 1: INFORMACIÓN FINANCIERA (SOLO PAGOS) */}
      <TabPanel value={selectedTab} index={1}>
        {/* Barra de progreso global */}
        {lead.deal && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
              Progreso de pago total:
            </Typography>
            <LinearProgress
              variant="determinate"
              value={avanceGlobal}
              sx={{
                height: 8,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00FFD1'
                }
              }}
            />
            <Typography variant="body2" sx={{ color: '#FFFFFF', mt: 1 }}>
              {`$${totalAbonadoGlobal.toLocaleString()} / $${lead.deal.monto_total?.toLocaleString()}`}
            </Typography>
          </Box>
        )}

        {lead.deal && lead.deal.pagos && lead.deal.pagos.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
              Calendario de Pagos
            </Typography>

            {/* Tabla de Pagos */}
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  backgroundColor: '#262626',
                  border: '1px solid rgba(0, 255, 209, 0.1)'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#FFFFFF' }}>Fecha de Pago</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }}>Monto</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }}>Estado</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }}>Progreso</TableCell>
                      <TableCell sx={{ color: '#FFFFFF' }} align="right">
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lead.deal.pagos.map((pago) => {
                      const sumAbonos = pago.transactions?.reduce((acc, tx) => acc + tx.monto_abono, 0) || 0;
                      const progresoPago = (sumAbonos / pago.monto) * 100;

                      return (
                        <TableRow 
                          key={pago.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                        >
                          <TableCell sx={{ color: '#FFFFFF' }}>
                            {DateTime.fromISO(pago.fecha_pago).toFormat('dd/MM/yyyy')}
                          </TableCell>
                          <TableCell sx={{ color: '#00FFD1', fontWeight: 600 }}>
                            ${pago.monto?.toLocaleString()}
                          </TableCell>
                          <TableCell sx={{ color: '#FFFFFF' }}>
                            <Chip
                              label={pago.estado}
                              size="small"
                              sx={{
                                backgroundColor: 
                                  pago.estado === 'pagada'
                                    ? 'rgba(76, 175, 80, 0.2)'
                                    : pago.estado === 'vencida'
                                    ? 'rgba(244, 67, 54, 0.2)'
                                    : pago.estado === 'proxima'
                                    ? 'rgba(255, 193, 7, 0.2)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                color: 
                                  pago.estado === 'pagada'
                                    ? '#4CAF50'
                                    : pago.estado === 'vencida'
                                    ? '#F44336'
                                    : pago.estado === 'proxima'
                                    ? '#FFC107'
                                    : '#FFFFFF',
                                textTransform: 'capitalize'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ width: '180px' }}>
                            <LinearProgress
                              variant="determinate"
                              value={progresoPago}
                              sx={{
                                height: 8,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#00FFD1'
                                }
                              }}
                            />
                            <Typography variant="body2" sx={{ color: '#AAAAAA', mt: 0.5 }}>
                              {`$${sumAbonos.toLocaleString()} / $${pago.monto.toLocaleString()}`}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                color: '#FFFFFF',
                                borderColor: 'rgba(255,255,255,0.3)',
                                '&:hover': {
                                  borderColor: '#00FFD1',
                                  backgroundColor: 'rgba(0, 255, 209, 0.1)'
                                }
                              }}
                              onClick={() => handleOpenAbonoDialog(pago)}
                            >
                              Abonar
                            </Button>

                            {/* Botón "Pagar Completo" */}
                            {pago.estado !== 'pagada' && (
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  backgroundColor: '#00FFD1',
                                  color: '#1E1E1E',
                                  '&:hover': {
                                    backgroundColor: '#00CCB7',
                                  }
                                }}
                                onClick={() => handleMarkAsPaidInFull(pago)}
                              >
                                Pago Completo
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        ) : (
          <Typography sx={{ color: '#AAAAAA' }}>
            No hay pagos programados para este Lead.
          </Typography>
        )}
      </TabPanel>

      {/* Diálogo para agregar abono parcial */}
      <PartialPaymentDialog
        open={openDialog}
        onClose={handleCloseAbonoDialog}
        onSave={handleSaveAbono}
        payment={selectedPayment}
        dealId={lead.deal?.id}
      />
    </Box>
  );
};

export default LeadDetails;

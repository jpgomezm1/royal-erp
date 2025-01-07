import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Switch,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { egresoRecurrenteService } from '../../../../../services/api';
import { TIPOS_GASTO, METODO_PAGO_COLORS } from '../../../../../constants/gastos';
import NewEgresoRecurrenteDialog from './NewEgresoRecurrenteDialog';

const EgresosRecurrentes = () => {
  const [egresosRecurrentes, setEgresosRecurrentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEgreso, setSelectedEgreso] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEgresosRecurrentes();
  }, []);

  const fetchEgresosRecurrentes = async () => {
    try {
      const data = await egresoRecurrenteService.getAllEgresosRecurrentes();
      setEgresosRecurrentes(data);
    } catch (error) {
      showNotification('Error al cargar los egresos recurrentes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSave = async (egresoData) => {
    try {
      if (selectedEgreso) {
        await egresoRecurrenteService.updateEgresoRecurrente(selectedEgreso.id, egresoData);
        showNotification('Egreso recurrente actualizado exitosamente');
      } else {
        await egresoRecurrenteService.createEgresoRecurrente(egresoData);
        showNotification('Egreso recurrente creado exitosamente');
      }
      setOpenDialog(false);
      setSelectedEgreso(null);
      fetchEgresosRecurrentes();
    } catch (error) {
      showNotification('Error al guardar el egreso recurrente', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este egreso recurrente?')) {
      try {
        await egresoRecurrenteService.deleteEgresoRecurrente(id);
        showNotification('Egreso recurrente eliminado exitosamente');
        fetchEgresosRecurrentes();
      } catch (error) {
        showNotification('Error al eliminar el egreso recurrente', 'error');
      }
    }
  };

  const handleToggleActive = async (egreso) => {
    try {
      await egresoRecurrenteService.updateEgresoRecurrente(egreso.id, {
        ...egreso,
        activo: !egreso.activo
      });
      fetchEgresosRecurrentes();
      showNotification(`Egreso recurrente ${egreso.activo ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error) {
      showNotification('Error al actualizar el estado del egreso recurrente', 'error');
    }
  };

  const handleProcesarEgresos = async () => {
    try {
      const result = await egresoRecurrenteService.procesarEgresosRecurrentes();
      showNotification(result.message);
    } catch (error) {
      showNotification('Error al procesar los egresos recurrentes', 'error');
    }
  };

  const getProximoCobro = (egreso) => {
    if (!egreso.activo) return 'Inactivo';
    
    const now = DateTime.now();
    const diaCobro = egreso.dia_cobro;
    let proximaFecha;

    if (now.day <= diaCobro) {
      proximaFecha = DateTime.fromObject({ year: now.year, month: now.month, day: diaCobro });
    } else {
      proximaFecha = DateTime.fromObject({ year: now.year, month: now.month, day: diaCobro }).plus({ months: 1 });
    }

    if (egreso.fecha_fin && DateTime.fromISO(egreso.fecha_fin) < proximaFecha) {
      return 'Finalizado';
    }

    return proximaFecha.toFormat('dd/MM/yyyy');
  };

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#2C2C2C',
          mb: 3,
          borderRadius: 2,
          p: 2.5,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
            Egresos Recurrentes
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleProcesarEgresos}
              sx={{
                backgroundColor: '#FF8C00',
                color: '#FFF',
                '&:hover': { backgroundColor: '#FF7000' },
              }}
            >
              Procesar Cobros
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                backgroundColor: '#FF6347',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#FF4500' },
              }}
            >
              Nuevo Egreso Recurrente
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#2C2C2C' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              '& th': { fontWeight: 600 }
            }}>
              <TableCell sx={{ color: '#FFFFFF' }}>Concepto</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Monto</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Tipo</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Método de Pago</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Día de Cobro</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Próximo Cobro</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Estado</TableCell>
              <TableCell sx={{ color: '#FFFFFF' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {egresosRecurrentes.map((egreso) => (
              <TableRow key={egreso.id}>
                <TableCell sx={{ color: '#FFFFFF' }}>
                  {egreso.concepto}
                </TableCell>
                <TableCell sx={{ color: '#FF6347' }}>
                  ${egreso.monto.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={TIPOS_GASTO[egreso.tipo_gasto]}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 99, 71, 0.1)',
                      color: '#FF6347'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={egreso.metodo_pago}
                    size="small"
                    sx={{
                      backgroundColor: `${METODO_PAGO_COLORS[egreso.metodo_pago]}20`,
                      color: METODO_PAGO_COLORS[egreso.metodo_pago]
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#FFFFFF' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ color: '#FF6347', fontSize: 20 }} />
                    {egreso.dia_cobro}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#FFFFFF' }}>
                  {getProximoCobro(egreso)}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={egreso.activo}
                    onChange={() => handleToggleActive(egreso)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF6347',
                        '&:hover': { backgroundColor: 'rgba(255, 99, 71, 0.1)' },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF6347',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          setSelectedEgreso(egreso);
                          setOpenDialog(true);
                        }}
                        sx={{ 
                          color: '#FF6347',
                          '&:hover': { backgroundColor: 'rgba(255, 99, 71, 0.1)' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDelete(egreso.id)}
                        sx={{ 
                          color: '#f44336',
                          '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Edit */}
      <NewEgresoRecurrenteDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedEgreso(null);
        }}
        onSave={handleSave}
        egreso={selectedEgreso}
      />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EgresosRecurrentes;
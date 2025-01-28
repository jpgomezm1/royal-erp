// LegacyClientDetails.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Divider,
  Select,
  MenuItem
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { legacyClientService } from '../../../../../services/api';

const LegacyClientDetails = ({ client, onClose }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [montoAbono, setMontoAbono] = useState('');
  const [errors, setErrors] = useState({});

  // Estados para editar metodo_pago
  const [editingMetodoPago, setEditingMetodoPago] = useState(false);
  const [metodoPagoTemp, setMetodoPagoTemp] = useState(client.metodo_pago || 'desconocido');

  // Para actualizar el metodo de pago en DB
  const handleSaveMetodoPago = async () => {
    try {
      const updated = await legacyClientService.updateLegacyClient(client.id, {
        metodo_pago: metodoPagoTemp
      });
      // Recargamos o actualizamos la vista principal
      onClose(updated);
    } catch (err) {
      console.error('Error updating metodo_pago:', err);
    }
  };

  const handleAddPayment = async () => {
    if (!montoAbono || parseFloat(montoAbono) <= 0) {
      setErrors({ montoAbono: 'Ingrese un monto válido' });
      return;
    }
    try {
      const data = {
        monto_abono: parseFloat(montoAbono),
      };
      const updatedClient = await legacyClientService.addPayment(client.id, data);
      // actualiza la vista
      onClose(updatedClient);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleCancelForm = () => {
    setShowPaymentForm(false);
    setMontoAbono('');
    setErrors({});
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
          {client.nombre}
        </Typography>
        <IconButton onClick={() => onClose()} sx={{ color: '#FFFFFF' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: '#262626',
          borderRadius: 2,
          border: '1px solid rgba(0,255,209,0.1)',
        }}
      >
        <Typography sx={{ color: '#AAAAAA', mb: 1, fontWeight: 600 }}>
          Información
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={{ color: '#FFFFFF' }}>
            <strong>País:</strong> {client.pais || 'N/D'}
          </Typography>
          <Typography sx={{ color: '#FFFFFF' }}>
            <strong>Total Comprado:</strong> ${client.total_comprado.toLocaleString()}
          </Typography>
          <Typography sx={{ color: '#FFFFFF' }}>
            <strong>Total Pagado:</strong> ${client.total_pagado.toLocaleString()}
          </Typography>
          <Typography sx={{ color: '#FFFFFF' }}>
            <strong>Saldo:</strong> ${client.saldo_pendiente.toLocaleString()}
          </Typography>
          <Typography sx={{ color: '#FFFFFF' }}>
            <strong>Notas:</strong> {client.notas || ''}
          </Typography>

          {/* METODO DE PAGO */}
          {!editingMetodoPago ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography sx={{ color: '#FFFFFF' }}>
                <strong>Método de Pago:</strong> {client.metodo_pago || 'desconocido'}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: '#FFFFFF',
                  borderColor: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: '#00FFD1',
                  },
                  fontSize: '0.8rem'
                }}
                onClick={() => {
                  setMetodoPagoTemp(client.metodo_pago || 'desconocido');
                  setEditingMetodoPago(true);
                }}
              >
                Editar
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, maxWidth: 250 }}>
              <Typography sx={{ color: '#FFFFFF' }}>Cambiar Método de Pago:</Typography>
              <Select
                value={metodoPagoTemp}
                onChange={(e) => setMetodoPagoTemp(e.target.value)}
                sx={{
                  color: '#FFFFFF',
                  backgroundColor: '#1E1E1E',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFFFFF'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00FFD1'
                  },
                }}
              >
                <MenuItem value="desconocido">Desconocido</MenuItem>
                {/* REEMPLAZAMOS TRANSFERENCIA POR STRIPE */}
                <MenuItem value="stripe">Stripe</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="crypto">Cripto</MenuItem>
              </Select>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#00FFD1',
                    color: '#1E1E1E',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#00CCB7' },
                  }}
                  onClick={() => {
                    handleSaveMetodoPago();
                    setEditingMetodoPago(false);
                  }}
                >
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: '#00FFD1',
                    },
                  }}
                  onClick={() => setEditingMetodoPago(false)}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* TABLA DE PAGOS */}
      <Typography sx={{ color: '#FFFFFF', mb: 1, fontWeight: 600 }}>
        Pagos Registrados
      </Typography>
      <Paper
        sx={{
          p: 2,
          backgroundColor: '#262626',
          borderRadius: 2,
          border: '1px solid rgba(0,255,209,0.1)',
        }}
      >
        {client.pagos && client.pagos.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    color: '#FFFFFF',
                    backgroundColor: '#1E1E1E',
                    fontWeight: 600,
                  },
                }}
              >
                <TableCell>Fecha</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Notas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {client.pagos.map((pago) => (
                <TableRow
                  key={pago.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <TableCell sx={{ color: '#FFFFFF' }}>
                    {new Date(pago.fecha_abono).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: '#00FFD1', fontWeight: 600 }}>
                    ${pago.monto_abono.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>{pago.notas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography sx={{ color: '#AAAAAA' }}>
            Aún no hay pagos registrados.
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Formulario para registrar un nuevo abono */}
      {!showPaymentForm ? (
        <Button
          sx={{ 
            mt: 2, 
            backgroundColor: '#00FFD1', 
            color: '#1E1E1E',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#00CCB7' }
          }}
          variant="contained"
          onClick={() => setShowPaymentForm(true)}
        >
          Registrar pago
        </Button>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: '#FFFFFF', mb: 1 }}>
            Ingrese un monto a abonar:
          </Typography>
          <TextField
            variant="outlined"
            type="number"
            value={montoAbono}
            onChange={(e) => setMontoAbono(e.target.value)}
            sx={{
              maxWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FFD1',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
              mb: 1
            }}
          />
          {errors.montoAbono && (
            <Typography sx={{ color: 'red' }}>{errors.montoAbono}</Typography>
          )}

          <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: '#00FFD1',
                },
              }}
              onClick={handleCancelForm}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#00FFD1',
                color: '#1E1E1E',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#00CCB7' },
              }}
              onClick={handleAddPayment}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LegacyClientDetails;

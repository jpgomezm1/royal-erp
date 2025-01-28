// LegacyClientTable.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  CircularProgress,
  Fade
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { legacyClientService } from '../../../../../services/api';

const LegacyClientTable = ({ onSelectClient }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await legacyClientService.getAllLegacyClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching legacy clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ width: '100%' }}>
        {/* Encabezado */}
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
          Clientes Especiales
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress sx={{ color: '#00FFD1' }} size={24} />
            <Typography sx={{ color: '#AAAAAA' }}>Cargando...</Typography>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#2C2C2C',
              borderRadius: 2,
              border: '1px solid rgba(0, 255, 209, 0.1)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#1E1E1E',
                      '& th': {
                        color: '#FFFFFF',
                        fontWeight: 600,
                      },
                    }}
                  >
                    <TableCell>Nombre</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell>Método de Pago</TableCell> {/* NUEVO */}
                    <TableCell>Total Comprado</TableCell>
                    <TableCell>Total Pagado</TableCell>
                    <TableCell>Saldo</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((client) => (
                      <TableRow
                        key={client.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 255, 209, 0.05)',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <TableCell sx={{ color: '#FFFFFF' }}>
                          {client.nombre}
                        </TableCell>
                        <TableCell sx={{ color: '#FFFFFF' }}>
                          {client.pais || 'N/D'}
                        </TableCell>
                        {/* Muestra metodo_pago */}
                        <TableCell sx={{ color: '#FFFFFF' }}>
                          {client.metodo_pago || 'desconocido'}
                        </TableCell>
                        <TableCell sx={{ color: '#00FFD1', fontWeight: 600 }}>
                          ${client.total_comprado.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: '#00FFD1', fontWeight: 600 }}>
                          ${client.total_pagado.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                          ${client.saldo_pendiente.toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            sx={{
                              color: '#00FFD1',
                              transition: '0.2s',
                              '&:hover': { color: '#00CCB7' },
                            }}
                            onClick={() => onSelectClient(client)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={clients.length}
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
                backgroundColor: '#1E1E1E',
              }}
            />
          </Paper>
        )}
      </Box>
    </Fade>
  );
};

export default LegacyClientTable;

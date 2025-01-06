import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CloudDownload, UploadFile, CloudUpload } from '@mui/icons-material';
import { ingresoService } from '../../../../../services/api';
import * as XLSX from 'xlsx';

const BulkUploadDialog = ({ open, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar el template descargable
  const handleDownloadTemplate = () => {
    const templateData = [
      { Fecha: '01/01/2024', Concepto: 'Venta de producto', Monto: 1000, Plataforma: 'Efectivo' },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'Template_Carga_Ingresos.xlsx');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null); // Limpiar errores al seleccionar un nuevo archivo
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo antes de continuar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await ingresoService.bulkUpload(file);
      onUploadSuccess(result); // Actualizar la lista de ingresos en el componente padre
      onClose(); // Cerrar el diálogo
    } catch (err) {
      setError(err.message || 'Error al cargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CloudUpload sx={{ color: '#00FFD1', fontSize: 28 }} />
          Carga Masiva de Ingresos
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ py: 2 }}>
          <Typography variant="body1">
            Descarga el template, complétalo con los datos y súbelo para registrar múltiples ingresos.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            onClick={handleDownloadTemplate}
            sx={{
              alignSelf: 'start',
              color: '#00FFD1',
              borderColor: '#00FFD1',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
              },
            }}
          >
            Descargar Template
          </Button>
          <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
            <strong>Instrucciones:</strong> Asegúrate de que las columnas del archivo sean exactamente las siguientes: 
            <strong> Fecha, Concepto, Monto, Plataforma</strong>.
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
              sx={{
                backgroundColor: '#00AC47',
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#00712f',
                },
              }}
            >
              Seleccionar Archivo
              <input
                type="file"
                accept=".xlsx"
                hidden
                onChange={handleFileChange}
                disabled={loading}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                Archivo seleccionado: <strong>{file.name}</strong>
              </Typography>
            )}
          </Box>

          {loading && <LinearProgress sx={{ mt: 2 }} />}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#FF1744',
            '&:hover': {
              backgroundColor: 'rgba(255, 23, 68, 0.1)',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
          sx={{
            backgroundColor: '#00FFD1',
            color: '#1E1E1E',
            '&:hover': {
              backgroundColor: '#00CCB7',
            },
          }}
        >
          {loading ? 'Subiendo...' : 'Cargar Archivo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUploadDialog;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import { 
  CloudDownload, 
  UploadFile, 
  CloudUpload 
} from '@mui/icons-material';
import { egresoService } from '../../../../../services/api';
import * as XLSX from 'xlsx';
import { TIPOS_GASTO, METODOS_PAGO } from '../../../../../constants/gastos';

const BulkUploadDialog = ({ open, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar el template descargable
  const handleDownloadTemplate = () => {
    const templateData = [
      { 
        Fecha: '01/01/2024', 
        Concepto: 'Ejemplo de gasto', 
        Monto: 1000, 
        'Tipo Gasto': 'GAF', // Usar abreviaciones definidas
        'Método Pago': 'BBVA',
        Descripción: 'Descripción opcional del gasto'
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Agregar notas sobre tipos de gasto válidos
    const tiposGastoValidos = Object.entries(TIPOS_GASTO)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const metodosValidos = METODOS_PAGO.join(', ');

    const wsName = 'Instrucciones';
    const wsData = [
      ['Instrucciones para la carga masiva de egresos:'],
      [''],
      ['Tipos de gasto válidos:'],
      [tiposGastoValidos],
      [''],
      ['Métodos de pago válidos:'],
      [metodosValidos],
      [''],
      ['Notas importantes:'],
      ['- La fecha debe estar en formato DD/MM/YYYY'],
      ['- El monto debe ser un número positivo'],
      ['- El tipo de gasto debe ser uno de los códigos listados arriba'],
      ['- El método de pago debe ser uno de los listados arriba'],
      ['- La descripción es opcional']
    ];

    const wsInstrucciones = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, wsInstrucciones, wsName);

    XLSX.writeFile(workbook, 'Template_Carga_Egresos.xlsx');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo antes de continuar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await egresoService.bulkUpload(file);
      onUploadSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al cargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#2C2C2C',
          backgroundImage: 'linear-gradient(to bottom right, rgba(255, 99, 71, 0.05), rgba(0, 0, 0, 0))'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CloudUpload sx={{ color: '#FF6347', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
            Carga Masiva de Egresos
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
            Descarga el template, complétalo con los datos y súbelo para registrar múltiples egresos.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            onClick={handleDownloadTemplate}
            sx={{
              alignSelf: 'start',
              color: '#FF6347',
              borderColor: '#FF6347',
              '&:hover': {
                backgroundColor: 'rgba(255, 99, 71, 0.1)',
                borderColor: '#FF6347',
              },
            }}
          >
            Descargar Template
          </Button>
          <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
            <strong>Instrucciones:</strong> Asegúrate de que las columnas del archivo sean exactamente las siguientes: 
            <strong> Fecha, Concepto, Monto, Tipo Gasto, Método Pago, Descripción</strong>.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1 }}>
              Tipos de gasto válidos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(TIPOS_GASTO).map(([key, value]) => (
                <Typography 
                  key={key} 
                  variant="caption" 
                  sx={{ 
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 99, 71, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {key}: {value}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1 }}>
              Métodos de pago válidos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {METODOS_PAGO.map((metodo) => (
                <Typography 
                  key={metodo} 
                  variant="caption" 
                  sx={{ 
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 99, 71, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {metodo}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
              sx={{
                backgroundColor: '#FF8C00',
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#FF7000',
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
              <Typography variant="body2" sx={{ mt: 1, color: '#AAAAAA' }}>
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
            backgroundColor: '#FF6347',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#FF4500',
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
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Divider,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Download as DownloadIcon,
  InfoOutlined as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

// Función auxiliar para formatear números
const formatNumber = (number) => {
  return number !== null && number !== undefined ? 
    number.toLocaleString() : '0';
};

// Función para calcular porcentajes de forma segura
const calculatePercentage = (value, total) => {
  if (!value || !total) return 0;
  return (value / total) * 100;
};

// Función para calcular variación de forma segura
const calculateVariation = (current, previous) => {
  if (!current || !previous) return 0;
  return ((current - previous) / previous) * 100;
};

const RowDivider = () => (
  <TableRow>
    <TableCell colSpan={6}>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
    </TableCell>
  </TableRow>
);

const ResultRow = ({ 
  concept = '', 
  currentAmount = 0,
  previousAmount = null,
  percentage = null, 
  indent = 0, 
  bold = false,
  info = null,
  total = false,
  subtotal = false,
  positive = true,
  totalIngresos = 0
}) => {
  const variation = previousAmount !== null ? 
    calculateVariation(currentAmount, previousAmount) : null;

  return (
    <TableRow 
      sx={{ 
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor: total ? 'rgba(0, 255, 209, 0.05)' : 
                      subtotal ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
      }}
    >
      <TableCell 
        component="th" 
        sx={{ 
          pl: indent * 4 + 2,
          color: '#FFFFFF',
          fontWeight: bold || total || subtotal ? 600 : 400,
          fontSize: total ? '1.1rem' : subtotal ? '1.05rem' : '1rem',
          borderBottom: total ? '1px double rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {concept}
          {info && (
            <Tooltip title={info} arrow>
              <InfoIcon sx={{ fontSize: 16, color: '#AAAAAA' }} />
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell 
        align="right"
        sx={{ 
          color: positive ? '#00FFD1' : '#FF6347',
          fontWeight: bold || total || subtotal ? 600 : 400,
          fontSize: total ? '1.1rem' : subtotal ? '1.05rem' : '1rem',
          borderBottom: total ? '1px double rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        ${formatNumber(currentAmount)}
      </TableCell>
      {previousAmount !== null && (
        <TableCell 
          align="right"
          sx={{ 
            color: '#AAAAAA',
            fontWeight: bold || total || subtotal ? 600 : 400,
            fontSize: total ? '1.1rem' : subtotal ? '1.05rem' : '1rem',
            borderBottom: total ? '1px double rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          ${formatNumber(previousAmount)}
        </TableCell>
      )}
      {variation !== null && (
        <TableCell 
          align="right"
          sx={{ 
            color: variation >= 0 ? '#4CAF50' : '#F44336',
            fontWeight: bold || total || subtotal ? 600 : 400,
            fontSize: total ? '1.1rem' : subtotal ? '1.05rem' : '1rem',
            borderBottom: total ? '1px double rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
            {variation >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            {Math.abs(variation).toFixed(1)}%
          </Box>
        </TableCell>
      )}
      <TableCell 
        align="right"
        sx={{ 
          color: '#AAAAAA',
          fontWeight: bold || total || subtotal ? 600 : 400,
          fontSize: total ? '1.1rem' : subtotal ? '1.05rem' : '1rem',
          borderBottom: total ? '1px double rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {percentage !== null ? `${percentage.toFixed(1)}%` : '-'}
      </TableCell>
      <TableCell 
        align="right"
        sx={{ 
          color: '#AAAAAA',
          fontWeight: bold || total || subtotal ? 600 : 400,
          fontSize: total ? '1.1rem' : subtotal ? '1.05rem' : '1rem',
          borderBottom: total ? '1px double rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {currentAmount && totalIngresos ? 
          `${calculatePercentage(currentAmount, totalIngresos).toFixed(1)}%` : 
          '-'
        }
      </TableCell>
    </TableRow>
  );
};

const FinancialIndicator = ({ title = '', value = 0, previousValue = null, info = null }) => {
    const variation = previousValue !== null ? 
      calculateVariation(value, previousValue) : null;
  
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
            {title}
          </Typography>
          {info && (
            <Tooltip title={info} arrow>
              <InfoIcon sx={{ fontSize: 16, color: '#AAAAAA' }} />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
            {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
          </Typography>
          {variation !== null && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: variation >= 0 ? '#4CAF50' : '#F44336',
                bgcolor: variation >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            >
              {variation >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              <Typography variant="body2">
                {Math.abs(variation).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  
  const EstadoResultados = ({ data = {}, period = 'Período actual' }) => {
    const {
      desglose_ingresos = {},
      desglose_egresos = {},
      resumen = {
        total_ingresos: 0,
        total_egresos: 0,
        utilidad: 0,
        margen: 0,
        ebitda: 0,
        ebitda_margin: 0,
        roi: 0,
        operating_ratio: 0,
        previous_total_ingresos: 0,
        previous_total_egresos: 0,
        previous_utilidad: 0,
        previous_margen: 0,
        previous_ebitda: 0,
        previous_ebitda_margin: 0,
        previous_roi: 0,
        previous_operating_ratio: 0
      }
    } = data;
  
    // Agrupar ingresos por categoría
    const ingresosPorCategoria = Object.entries(desglose_ingresos).reduce((acc, [tipo, monto = 0]) => {
      const categoria = tipo.split('_')[0];
      if (!acc[categoria]) {
        acc[categoria] = { total: 0, items: [] };
      }
      acc[categoria].total += monto;
      acc[categoria].items.push({ tipo, monto });
      return acc;
    }, {});
  
    // Agrupar egresos por tipo
    const egresosPorTipo = Object.entries(desglose_egresos).reduce((acc, [tipo, monto = 0]) => {
      const categoria = tipo.includes('FIJO') ? 'FIJOS' : 'VARIABLES';
      if (!acc[categoria]) {
        acc[categoria] = { total: 0, items: [] };
      }
      acc[categoria].total += monto;
      acc[categoria].items.push({ tipo, monto });
      return acc;
    }, {});
  
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#2C2C2C',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header con KPIs */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3 }}>
            Estado de Resultados
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FinancialIndicator
                title="Margen Operativo"
                value={resumen.margen}
                previousValue={resumen.previous_margen}
                info="Utilidad operacional como porcentaje de los ingresos"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FinancialIndicator
                title="ROI"
                value={resumen.roi}
                previousValue={resumen.previous_roi}
                info="Retorno sobre la inversión"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FinancialIndicator
                title="Operating Ratio"
                value={resumen.operating_ratio}
                previousValue={resumen.previous_operating_ratio}
                info="Eficiencia operativa"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FinancialIndicator
                title="Margen EBITDA"
                value={resumen.ebitda_margin}
                previousValue={resumen.previous_ebitda_margin}
                info="Margen antes de intereses, impuestos, depreciación y amortización"
              />
            </Grid>
          </Grid>
        </Box>
  
        {/* Tabla Principal - Contenido existente */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>Concepto</TableCell>
                <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 600 }}>Actual</TableCell>
                <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 600 }}>Anterior</TableCell>
                <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 600 }}>Variación</TableCell>
                <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 600 }}>% Categoría</TableCell>
                <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 600 }}>% Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Ingresos Operacionales */}
              <ResultRow 
                concept="INGRESOS OPERACIONALES"
                currentAmount={resumen.total_ingresos}
                previousAmount={resumen.previous_total_ingresos}
                percentage={100}
                bold
                total
                info="Total de ingresos del período"
                totalIngresos={resumen.total_ingresos}
              />
  
              {Object.entries(ingresosPorCategoria).map(([categoria, datos]) => (
                <React.Fragment key={categoria}>
                  <ResultRow
                    concept={categoria}
                    currentAmount={datos.total}
                    previousAmount={0}
                    percentage={calculatePercentage(datos.total, resumen.total_ingresos)}
                    bold
                    subtotal
                    totalIngresos={resumen.total_ingresos}
                  />
                  {datos.items.map(({ tipo, monto }) => (
                    <ResultRow
                      key={tipo}
                      concept={tipo}
                      currentAmount={monto}
                      previousAmount={0}
                      percentage={calculatePercentage(monto, datos.total)}
                      indent={1}
                      totalIngresos={resumen.total_ingresos}
                    />
                  ))}
                </React.Fragment>
              ))}
  
              <RowDivider />
  
              {/* Egresos Operacionales */}
              <ResultRow 
                concept="EGRESOS OPERACIONALES"
                currentAmount={resumen.total_egresos}
                previousAmount={resumen.previous_total_egresos}
                percentage={calculatePercentage(resumen.total_egresos, resumen.total_ingresos)}
                bold
                total
                positive={false}
                info="Total de egresos del período"
                totalIngresos={resumen.total_ingresos}
              />
  
              {Object.entries(egresosPorTipo).map(([categoria, datos]) => (
                <React.Fragment key={categoria}>
                  <ResultRow
                    concept={`GASTOS ${categoria}`}
                    currentAmount={datos.total}
                    previousAmount={0}
                    percentage={calculatePercentage(datos.total, resumen.total_egresos)}
                    bold
                    subtotal
                    positive={false}
                    totalIngresos={resumen.total_ingresos}
                  />
                  {datos.items.map(({ tipo, monto }) => (
                    <ResultRow
                      key={tipo}
                      concept={tipo}
                      currentAmount={monto}
                      previousAmount={0}
                      percentage={calculatePercentage(monto, datos.total)}
                      indent={1}
                      positive={false}
                      totalIngresos={resumen.total_ingresos}
                    />
                  ))}
                </React.Fragment>
              ))}
  
              <RowDivider />
  
              {/* Resultados Financieros */}
              <ResultRow 
                concept="UTILIDAD OPERACIONAL"
                currentAmount={resumen.utilidad}
                previousAmount={resumen.previous_utilidad}
                percentage={resumen.margen}
                total
                info="Utilidad antes de impuestos"
                totalIngresos={resumen.total_ingresos}
              />
  
              <ResultRow
                concept="EBITDA"
                currentAmount={resumen.ebitda}
                previousAmount={resumen.previous_ebitda}
                percentage={resumen.ebitda_margin}
                bold
                info="Beneficio antes de intereses, impuestos, depreciaciones y amortizaciones"
                totalIngresos={resumen.total_ingresos}
              />
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              color: '#00FFD1',
              borderColor: '#00FFD1',
              '&:hover': {
                borderColor: '#00FFD1',
                backgroundColor: 'rgba(0, 255, 209, 0.1)'
              }
            }}
          >
            Exportar a PDF
          </Button>
          <Typography variant="caption" sx={{ color: '#AAAAAA', ml: 2, display: 'inline-block' }}>
            Período: {period}
          </Typography>
        </Box>
  
        {/* Notas y Aclaraciones */}
        <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1 }}>
            Notas:
          </Typography>
          <Typography variant="caption" sx={{ color: '#AAAAAA', display: 'block' }}>
            • Los porcentajes de categoría representan la proporción respecto al total de su grupo.
          </Typography>
          <Typography variant="caption" sx={{ color: '#AAAAAA', display: 'block' }}>
            • Los porcentajes totales están calculados sobre el total de ingresos operacionales.
          </Typography>
          <Typography variant="caption" sx={{ color: '#AAAAAA', display: 'block' }}>
            • Las variaciones se calculan respecto al período anterior.
          </Typography>
          <Typography variant="caption" sx={{ color: '#AAAAAA', display: 'block' }}>
            • EBITDA: Earnings Before Interest, Taxes, Depreciation, and Amortization.
          </Typography>
        </Box>
      </Paper>
    );
  };
  
  export default EstadoResultados;
import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const MetricasComerciales = () => {
  // Data ficticia
  const monthlyData = [
    { month: 'Ene', ventas: 12500, leads: 85, conversion: 15 },
    { month: 'Feb', ventas: 15800, leads: 92, conversion: 18 },
    { month: 'Mar', ventas: 18900, leads: 105, conversion: 20 },
    { month: 'Abr', ventas: 21500, leads: 118, conversion: 22 },
    { month: 'May', ventas: 19800, leads: 98, conversion: 21 },
    { month: 'Jun', ventas: 23500, leads: 125, conversion: 23 },
  ];

  const sourcesData = [
    { name: 'Facebook Ads', value: 45 },
    { name: 'Instagram', value: 25 },
    { name: 'Referidos', value: 15 },
    { name: 'Orgánico', value: 10 },
    { name: 'TikTok', value: 5 },
  ];

  const programData = [
    { name: 'Curso Básico', estudiantes: 45, ingresos: 22500 },
    { name: 'Curso Avanzado', estudiantes: 30, ingresos: 45000 },
    { name: 'Mentoria 1:1', estudiantes: 10, ingresos: 25000 },
    { name: 'Señales', estudiantes: 60, ingresos: 18000 },
    { name: 'Comunidad', estudiantes: 120, ingresos: 36000 },
  ];

  const COLORS = ['#00FFD1', '#2196F3', '#FFC107', '#9C27B0', '#F44336'];

  const kpis = [
    {
      title: 'Ingresos Totales',
      value: '$146,500',
      change: '+23.5%',
      period: 'vs mes anterior'
    },
    {
      title: 'Nuevos Estudiantes',
      value: '265',
      change: '+15.2%',
      period: 'vs mes anterior'
    },
    {
      title: 'Tasa de Conversión',
      value: '23%',
      change: '+2.1%',
      period: 'vs mes anterior'
    },
    {
      title: 'Ticket Promedio',
      value: '$552',
      change: '+5.5%',
      period: 'vs mes anterior'
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 3 }}>
        Métricas Comerciales
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: '#2C2C2C', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#AAAAAA' }}>
                  {kpi.title}
                </Typography>
                <Typography variant="h4" sx={{ color: '#00FFD1', my: 1 }}>
                  {kpi.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: kpi.change.startsWith('+') ? '#4CAF50' : '#F44336'
                    }}
                  >
                    {kpi.change}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                    {kpi.period}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Ventas Mensuales */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, backgroundColor: '#2C2C2C' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3 }}>
              Tendencia de Ventas y Leads
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="month" stroke="#FFFFFF" />
                <YAxis yAxisId="left" stroke="#00FFD1" />
                <YAxis yAxisId="right" orientation="right" stroke="#FFC107" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ventas"
                  stroke="#00FFD1"
                  name="Ventas ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="leads"
                  stroke="#FFC107"
                  name="Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Fuentes de Leads */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, backgroundColor: '#2C2C2C', height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3 }}>
              Fuentes de Leads
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Rendimiento por Programa */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#2C2C2C' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3 }}>
              Rendimiento por Programa
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={programData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis yAxisId="left" stroke="#00FFD1" />
                <YAxis yAxisId="right" orientation="right" stroke="#FFC107" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="ingresos" fill="#00FFD1" name="Ingresos ($)" />
                <Bar yAxisId="right" dataKey="estudiantes" fill="#FFC107" name="Estudiantes" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MetricasComerciales;
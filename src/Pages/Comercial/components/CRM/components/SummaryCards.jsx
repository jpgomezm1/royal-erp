import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  PeopleAlt as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

/**
 * Filtramos leads por crm_status:
 *  - LEAD
 *  - CLIENTE_INACTIVO
 *  - CLIENTE_ACTIVO
 *  - EX_CLIENTE
 */

const SummaryCards = ({ leads }) => {
  // Cálculos de estadísticas basados en 'crm_status'
  const totalLeads = leads.length;

  // Ejemplo de conteo por cada estado
  const totalLeadPotenciales = leads.filter(l => l.crm_status === 'LEAD').length;
  const totalClientesActivos = leads.filter(l => l.crm_status === 'CLIENTE_ACTIVO').length;
  const totalClientesInactivos = leads.filter(l => l.crm_status === 'CLIENTE_INACTIVO').length;
  const totalExClientes = leads.filter(l => l.crm_status === 'EX_CLIENTE').length;

  // Ejemplo de ingresos (sumando "monto_total" de los deals vigentes)
  // Aquí cada lead con crm_status=CLIENTE_ACTIVO o CLIENTE_INACTIVO tiene un deal con "monto_total"
  let totalRevenue = 0;
  leads.forEach((lead) => {
    if (lead.deal && (lead.crm_status === 'CLIENTE_ACTIVO' || lead.crm_status === 'CLIENTE_INACTIVO')) {
      totalRevenue += lead.deal.monto_total || 0;
    }
  });

  // Ejemplo de tasa de conversión: (CLIENTE_ACTIVO / totalLeads) * 100
  const conversionRate = totalLeads > 0
    ? (totalClientesActivos / totalLeads) * 100
    : 0;

  const cards = [
    {
      title: 'Clientes Activos',
      value: totalClientesActivos,
      icon: SchoolIcon,
      color: '#00FFD1',
      secondaryText: `${conversionRate.toFixed(1)}% tasa de conversión`
    },
    {
      title: 'Leads Potenciales',
      value: totalLeadPotenciales,
      icon: PeopleIcon,
      color: '#FFC107',
      secondaryText: 'Están en etapa de prospección'
    },
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: MoneyIcon,
      color: '#4CAF50',
      secondaryText: 'Suma de todos los deals vigentes'
    },
    {
      title: 'Clientes Inactivos / Ex',
      value: totalClientesInactivos + totalExClientes,
      icon: TrendingUpIcon,
      color: '#2196F3',
      secondaryText: 'Suscripciones futuras o vencidas'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ 
            backgroundColor: '#2C2C2C',
            border: `1px solid ${card.color}30`,
            height: '100%',
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent>
              <Box sx={{ 
                position: 'absolute',
                top: -20,
                left: 20,
                backgroundColor: card.color,
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${card.color}40`
              }}>
                <card.icon sx={{ color: '#1E1E1E' }} />
              </Box>

              <Box sx={{ pt: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#FFFFFF',
                    opacity: 0.7,
                    mb: 1
                  }}
                >
                  {card.title}
                </Typography>

                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: card.color,
                    mb: 1,
                    fontWeight: 600
                  }}
                >
                  {card.value}
                </Typography>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#FFFFFF',
                    opacity: 0.5,
                    fontSize: '0.75rem'
                  }}
                >
                  {card.secondaryText}
                </Typography>
              </Box>

              {/* Ejemplo: si quieres mostrar una barra de progreso en el primer card */}
              {card.title === 'Clientes Activos' && (
                <Tooltip title="Tasa de conversión (Clientes Activos / Total Leads)">
                  <LinearProgress
                    variant="determinate"
                    value={Number(conversionRate.toFixed(1))}
                    sx={{
                      mt: 2,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: `${card.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color,
                      }
                    }}
                  />
                </Tooltip>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;

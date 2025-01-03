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

const SummaryCards = ({ leads }) => {
  // Cálculos de estadísticas
  const totalLeads = leads.length;
  const activeStudents = leads.filter(lead => lead.status === 'STUDENT').length;
  const totalRevenue = leads
    .filter(lead => lead.status === 'STUDENT')
    .reduce((sum, lead) => sum + (lead.totalPaid || 0), 0);
  const conversionRate = totalLeads > 0 
    ? (activeStudents / totalLeads * 100).toFixed(1) 
    : 0;

  const cards = [
    {
      title: 'Estudiantes Activos',
      value: activeStudents,
      icon: SchoolIcon,
      color: '#00FFD1',
      secondaryText: `${conversionRate}% tasa de conversión`
    },
    {
      title: 'Leads en Pipeline',
      value: totalLeads - activeStudents,
      icon: PeopleIcon,
      color: '#FFC107',
      secondaryText: 'Prospectos activos'
    },
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: MoneyIcon,
      color: '#4CAF50',
      secondaryText: 'Valor total generado'
    },
    {
      title: 'Ticket Promedio',
      value: `$${totalRevenue > 0 ? (totalRevenue / activeStudents).toLocaleString() : 0}`,
      icon: TrendingUpIcon,
      color: '#2196F3',
      secondaryText: 'Por estudiante activo'
    }
  ];

  return (
    <Grid container spacing={3}>
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

              {card.title === 'Estudiantes Activos' && (
                <Tooltip title="Tasa de conversión">
                  <LinearProgress
                    variant="determinate"
                    value={Number(conversionRate)}
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
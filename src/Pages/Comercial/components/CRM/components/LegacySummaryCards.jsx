import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Tooltip } from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  AttachMoney as MoneyIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

/**
 * Recibe un array de LegacyClient con:
 *  - total_comprado
 *  - total_pagado (sum of abonos)
 *  - saldo_pendiente ( = total_comprado - total_pagado )
 * Y genera 4 tarjetas con la info resumida.
 */
const LegacySummaryCards = ({ clients }) => {
  // 1) Cantidad total de clientes
  const totalClients = clients.length;

  // 2) Sumas de montos
  let sumComprado = 0;
  let sumPagado = 0;
  let sumSaldo = 0;

  clients.forEach((c) => {
    sumComprado += c.total_comprado || 0;
    sumPagado += c.total_pagado || 0;
    sumSaldo += c.saldo_pendiente || 0;
  });

  // 3) Si quisieras alguna métrica de "porcentaje pagado" (opcional):
  // Por ejemplo, (sumPagado / sumComprado)*100 si sumComprado>0:
  const pctPagado = sumComprado > 0 ? (sumPagado / sumComprado) * 100 : 0;

  // Definimos las tarjetas
  const cards = [
    {
      title: 'Clientes Especiales',
      value: totalClients,
      icon: PeopleIcon,
      color: '#FFC107',
      secondaryText: 'Total registrados en esta sección'
    },
    {
      title: 'Total Comprado',
      value: `$${sumComprado.toLocaleString()}`,
      icon: MoneyIcon,
      color: '#4CAF50',
      secondaryText: 'Suma de las compras registradas'
    },
    {
      title: 'Total Pagado',
      value: `$${sumPagado.toLocaleString()}`,
      icon: WalletIcon,
      color: '#00FFD1',
      secondaryText: 'Sumatoria de los abonos hechos'
    },
    {
      title: 'Saldo Pendiente',
      value: `$${sumSaldo.toLocaleString()}`,
      icon: TrendingDownIcon,
      color: '#F44336',
      secondaryText: 'Saldo total aún adeudado'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              backgroundColor: '#2C2C2C',
              border: `1px solid ${card.color}30`,
              height: '100%',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <CardContent>
              <Box
                sx={{
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
                }}
              >
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

              {/* Ejemplo: una barra de progreso en "Total Pagado" */}
              {card.title === 'Total Pagado' && (
                <Tooltip title={`Porcentaje pagado respecto al total comprado: ${pctPagado.toFixed(1)}%`}>
                  <LinearProgress
                    variant="determinate"
                    value={Number(pctPagado.toFixed(1))}
                    sx={{
                      mt: 2,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: `${card.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color
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

export default LegacySummaryCards;

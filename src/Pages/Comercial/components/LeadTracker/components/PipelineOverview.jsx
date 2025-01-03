import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { pipelineStages } from '../leadConstants';

const PipelineOverview = ({ leads }) => {
  const getTotalLeads = () => leads.length;

  const getStageCount = (stage) => {
    return leads.filter(lead => lead.stage === stage).length;
  };

  const getStageValue = (stage) => {
    const total = getTotalLeads();
    if (total === 0) return 0;
    return (getStageCount(stage) / total) * 100;
  };

  const calculateStageRevenue = (stage) => {
    return leads
      .filter(lead => lead.stage === stage)
      .reduce((sum, lead) => sum + (Number(lead.presupuesto) || 0), 0);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
        Visión General del Pipeline
      </Typography>
      
      <Grid container spacing={2}>
        {Object.entries(pipelineStages).map(([stage, info]) => {
          const count = getStageCount(stage);
          const value = getStageValue(stage);
          const revenue = calculateStageRevenue(stage);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={stage}>
              <Card sx={{ 
                backgroundColor: '#2C2C2C',
                border: `1px solid ${info.color}30`,
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography sx={{ color: info.color, fontWeight: 500 }}>
                      {info.label}
                    </Typography>
                    <Typography sx={{ color: '#FFFFFF' }}>
                      {count}
                    </Typography>
                  </Box>

                  <Tooltip title={`${value.toFixed(1)}% del total`}>
                    <LinearProgress
                      variant="determinate"
                      value={value}
                      sx={{
                        backgroundColor: `${info.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: info.color,
                        },
                        mb: 2,
                        height: 6,
                        borderRadius: 3
                      }}
                    />
                  </Tooltip>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                      Valor potencial
                    </Typography>
                    <Typography sx={{ color: info.color, fontWeight: 500 }}>
                      ${revenue.toLocaleString()}
                    </Typography>
                  </Box>

                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#AAAAAA',
                      display: 'block',
                      mt: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {/* Summary Card */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ 
            backgroundColor: '#2C2C2C',
            border: '1px solid rgba(0, 255, 209, 0.1)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00FFD1', mb: 2 }}>
                Resumen Total
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                    Total Leads
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#FFFFFF' }}>
                    {getTotalLeads()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                    Valor Total Pipeline
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#00FFD1' }}>
                    ${leads.reduce((sum, lead) => sum + (Number(lead.presupuesto) || 0), 0).toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                    Tasa de Conversión
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#FFFFFF' }}>
                    {getTotalLeads() > 0 
                      ? ((getStageCount('CLOSED') / getTotalLeads()) * 100).toFixed(1)
                      : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PipelineOverview;
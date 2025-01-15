import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';

const ProductDistribution = ({ products }) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: '#2C2C2C',
      p: 3,
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 3 }}>
      Distribución por Producto
    </Typography>
    <Box>
      {products.map((product) => (
        <Box key={product.name} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
              {product.name}
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: '#00FFD1' }}>
                ${product.total.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                {product.count} ventas
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={product.percentage}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#00FFD1',
                borderRadius: 2,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  </Paper>
);

export default ProductDistribution;

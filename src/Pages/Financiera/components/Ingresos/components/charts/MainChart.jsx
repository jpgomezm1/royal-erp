import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Paper } from '@mui/material';
import CustomTooltip from './CustomTooltip';

const MainChart = ({ data, chartFilters, comparisonType }) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: '#2C2C2C',
      p: 3,
      mb: 3,
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      height: 300,
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FFD1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#00FFD1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#666666" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#666666" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#AAAAAA', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#AAAAAA', fontSize: 12 }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#00FFD1', strokeWidth: 1, strokeDasharray: '3 3' }} />
        {comparisonType !== 'none' && (
          <Area
            type="monotone"
            dataKey="previousTotal"
            stroke="#666666"
            strokeWidth={2}
            fill="url(#colorPrevious)"
            dot={false}
            activeDot={{ r: 6, fill: '#666666' }}
            name="Período anterior"
          />
        )}
        <Area
          type="monotone"
          dataKey="total"
          stroke="#00FFD1"
          strokeWidth={2}
          fill="url(#colorTotal)"
          dot={false}
          activeDot={{ r: 6, fill: '#00FFD1' }}
          name="Período actual"
        />
        {comparisonType !== 'none' && (
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#FFFFFF' }} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  </Paper>
);

export default MainChart;

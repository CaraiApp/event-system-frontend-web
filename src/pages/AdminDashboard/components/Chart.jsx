import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';

// Colores para gráficos
const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#009688'];

const Chart = ({ 
  type = 'line', 
  title, 
  data = [], 
  xKey = 'name', 
  series = [{ dataKey: 'value', name: 'Valor', color: '#2196f3' }],
  height = 300,
  showLegend = true,
  emptyMessage = "No hay datos disponibles"
}) => {
  // Renderizar el tipo de gráfico adecuado
  const renderChart = () => {
    // Verificar si hay datos
    if (!data || data.length === 0) {
      return (
        <Box 
          sx={{ 
            height, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexDirection: 'column',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body1" color="inherit" textAlign="center">
            {emptyMessage}
          </Typography>
        </Box>
      );
    }
    
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xKey} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip />
              {showLegend && <Legend />}
              {series.map((s, i) => (
                <Line
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || COLORS[i % COLORS.length]}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xKey} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip />
              {showLegend && <Legend />}
              {series.map((s, i) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.color || COLORS[i % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                dataKey={series[0]?.dataKey || 'value'}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <Typography color="error">Tipo de gráfico no soportado</Typography>;
    }
  };

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 2,
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        </Box>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default Chart;
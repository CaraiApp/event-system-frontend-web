import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

// Componente de tabla de datos reutilizable
const DataTable = ({
  columns,
  data,
  totalCount,
  page = 0,
  rowsPerPage = 10,
  loading = false,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDelete,
  handleView,
  handleToggleStatus,
  handleToggleFeatured,
  title
}) => {
  const theme = useTheme();
  const [hoveredRow, setHoveredRow] = useState(null);

  // Renderizar célula con formato según el tipo
  const renderCellContent = (column, item) => {
    const value = column.accessor ? column.accessor(item) : item[column.id];

    // Si la columna tiene un renderCell personalizado, úsalo
    if (column.renderCell) {
      return column.renderCell(item);
    }

    // Renderizar según el tipo de dato
    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      
      case 'datetime':
        return value ? new Date(value).toLocaleString() : '-';
      
      case 'status':
        return (
          <Chip
            label={value}
            size="small"
            icon={value === 'active' || value === 'published' ? <CheckCircleIcon /> : <CancelIcon />}
            color={
              value === 'active' || value === 'published' ? 'success' :
              value === 'pending' ? 'warning' : 'error'
            }
            variant="outlined"
          />
        );
      
      case 'boolean':
        return value ? (
          <Chip label="Sí" size="small" color="success" variant="outlined" />
        ) : (
          <Chip label="No" size="small" color="error" variant="outlined" />
        );
      
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      
      case 'featured':
        return value ? (
          <Chip 
            icon={<StarIcon />} 
            label="Destacado" 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ) : null;
      
      case 'progress':
        const percentage = Math.min(Math.max(value, 0), 100);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={percentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: 
                      percentage < 30 ? theme.palette.error.main :
                      percentage < 70 ? theme.palette.warning.main :
                      theme.palette.success.main,
                  },
                }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {percentage}%
              </Typography>
            </Box>
          </Box>
        );
      
      default:
        return value;
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      {title && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      )}
      
      <TableContainer sx={{ maxHeight: 'calc(100vh - 240px)' }}>
        {loading && (
          <LinearProgress 
            sx={{ 
              height: 3, 
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              },
            }} 
          />
        )}
        
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ 
                    minWidth: column.minWidth || 'auto',
                    maxWidth: column.maxWidth,
                    width: column.width,
                    backgroundColor: theme.palette.grey[50]
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {column.header}
                  </Typography>
                </TableCell>
              ))}
              
              {/* Columna de acciones */}
              {(handleEdit || handleDelete || handleView || handleToggleStatus || handleToggleFeatured) && (
                <TableCell 
                  align="center" 
                  style={{ 
                    width: 150, 
                    backgroundColor: theme.palette.grey[50]
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Acciones
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableRow 
                  hover 
                  role="checkbox" 
                  tabIndex={-1} 
                  key={row.id || index}
                  onMouseEnter={() => setHoveredRow(row.id || index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: theme.palette.action.hover 
                    },
                    cursor: 'pointer'
                  }}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column.id} 
                      align={column.align || 'left'}
                      onClick={() => handleView && handleView(row)}
                      sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: column.wrap ? 'normal' : 'nowrap',
                        maxWidth: column.maxWidth
                      }}
                    >
                      {renderCellContent(column, row)}
                    </TableCell>
                  ))}
                  
                  {/* Columna de acciones */}
                  {(handleEdit || handleDelete || handleView || handleToggleStatus || handleToggleFeatured) && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {handleView && (
                          <Tooltip title="Ver detalles">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(row);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {handleEdit && (
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {handleToggleStatus && (
                          <Tooltip title={row.status === 'published' ? 'Despublicar' : 'Publicar'}>
                            <IconButton 
                              size="small" 
                              color={row.status === 'published' ? 'error' : 'success'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(row);
                              }}
                            >
                              {row.status === 'published' ? (
                                <CancelIcon fontSize="small" />
                              ) : (
                                <CheckCircleIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {handleToggleFeatured && (
                          <Tooltip title={row.featured ? 'Quitar de destacados' : 'Destacar'}>
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFeatured(row);
                              }}
                            >
                              {row.featured ? (
                                <StarIcon fontSize="small" color="warning" />
                              ) : (
                                <StarOutlineIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {handleDelete && (
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            
            {data.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (handleEdit || handleDelete || handleView ? 1 : 0)} 
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {loading ? 'Cargando datos...' : 'No hay datos disponibles'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
};

export default DataTable;
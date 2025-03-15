import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Paper,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

// Mapeo de tipos de datos a renderizadores de celda
const cellRenderers = {
  // Renderiza un texto con avatar
  avatar: (value, rowData) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {rowData.avatar && (
        <Box
          component="img"
          src={rowData.avatar}
          alt={value}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            mr: 2,
            objectFit: 'cover'
          }}
        />
      )}
      <Typography variant="body2">{value}</Typography>
    </Box>
  ),
  
  // Renderiza fecha en formato local
  date: (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  // Renderiza chips de estado con colores
  status: (value) => {
    let color;
    let label = value;
    
    switch (value?.toLowerCase()) {
      case 'active':
      case 'activo':
        color = 'success';
        label = 'Activo';
        break;
      case 'pending':
      case 'pendiente':
        color = 'warning';
        label = 'Pendiente';
        break;
      case 'inactive':
      case 'inactivo':
        color = 'default';
        label = 'Inactivo';
        break;
      case 'cancelled':
      case 'cancelado':
        color = 'error';
        label = 'Cancelado';
        break;
      default:
        color = 'primary';
    }
    
    return (
      <Chip
        label={label}
        color={color}
        size="small"
        variant="outlined"
      />
    );
  },
  
  // Renderiza precio formateado
  price: (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value / 100);
  },
  
  // Renderiza número entero
  number: (value) => {
    return value.toLocaleString('es-ES');
  }
};

const DataTable = ({
  columns = [],
  data = [],
  title,
  loading = false,
  pagination = true,
  onRefresh,
  onRowClick,
  searchable = true,
  filterable = false,
  emptyMessage = "No hay datos disponibles",
  sortable = true,
  initialSort = null,
  initialSortDirection = 'asc',
  // Parámetros de paginación
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange
}) => {
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [localPage, setLocalPage] = useState(page);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(rowsPerPage);
  const [sortBy, setSortBy] = useState(initialSort);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  
  // Manejadores para paginación local
  const handleChangePage = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
      if (onPageChange) onPageChange(0); // Reset to first page
    } else {
      setLocalRowsPerPage(newRowsPerPage);
      setLocalPage(0);
    }
  };

  // Manejador para búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onPageChange) onPageChange(0); // Reset to first page when searching
    else setLocalPage(0);
  };

  // Manejador para ordenamiento
  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;
    
    const isAsc = sortBy === column.field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(column.field);
  };

  // Preparar datos según búsqueda, ordenación y paginación
  let filteredData = [...data];
  
  // Aplicar búsqueda si es local
  if (searchTerm && !onPageChange) {
    filteredData = filteredData.filter(row => 
      columns.some(column => 
        String(row[column.field]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
  
  // Aplicar ordenación si es local
  if (sortBy && !onPageChange) {
    filteredData.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  // Aplicar paginación si es local
  const paginatedData = !onPageChange 
    ? filteredData.slice(localPage * localRowsPerPage, localPage * localRowsPerPage + localRowsPerPage)
    : filteredData;

  // Renderizar celda según el tipo
  const renderCell = (column, row) => {
    const value = row[column.field];
    
    if (value === undefined || value === null) {
      return column.emptyValue || '-';
    }
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.type && cellRenderers[column.type]) {
      return cellRenderers[column.type](value, row);
    }
    
    return value;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      {/* Cabecera de la tabla */}
      {(title || searchable || onRefresh) && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {searchable && (
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            
            {filterable && (
              <Tooltip title="Filtrar">
                <IconButton color="default" size="small">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {onRefresh && (
              <Tooltip title="Actualizar">
                <IconButton onClick={onRefresh} color="primary" size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}
      
      {/* Tabla */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.field}
                  align={column.align || 'left'}
                  width={column.width}
                  sx={{ 
                    fontWeight: 'bold',
                    cursor: sortable && column.sortable ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: sortable && column.sortable ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                    }
                  }}
                  onClick={() => handleSort(column)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.headerName || column.field}
                    {sortable && column.sortable && sortBy === column.field && (
                      <SortIcon 
                        fontSize="small" 
                        sx={{ 
                          ml: 0.5,
                          transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                        }} 
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  hover
                  key={row.id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{ 
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${row.id || index}-${column.field}`}
                      align={column.align || 'left'}
                    >
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {loading ? 'Cargando datos...' : emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Paginación */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={onPageChange ? totalCount : filteredData.length}
          rowsPerPage={onRowsPerPageChange ? rowsPerPage : localRowsPerPage}
          page={onPageChange ? page : localPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default DataTable;
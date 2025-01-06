import React, { useState } from 'react';
import {
 Box,
 Paper,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 TextField,
 FormControl,
 InputLabel,
 Select,
 MenuItem,
 Chip,
 IconButton,
 Tooltip,
 ButtonGroup,
 Button,
 Typography,
 TablePagination,
 Divider,
 Collapse,
 Badge
} from '@mui/material';
import {
 FilterList as FilterIcon,
 CalendarToday as CalendarIcon,
 TrendingUp as TrendingUpIcon,
 SearchOutlined as SearchIcon,
 GetApp as DownloadIcon,
 ExpandMore as ExpandMoreIcon,
 RestartAlt as ResetIcon,
 Today as TodayIcon,
 DateRange as DateRangeIcon,
 Edit as EditIcon,
 Delete as DeleteIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { PLATAFORMAS, PLATAFORMA_COLORS } from '../../../mockData';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const DATE_PRESETS = [
 { label: 'Hoy', value: 'today', icon: TodayIcon },
 { label: 'Esta semana', value: 'week', icon: CalendarIcon },
 { label: 'Este mes', value: 'month', icon: CalendarIcon },
 { label: 'Último mes', value: 'lastMonth', icon: CalendarIcon },
 { label: 'Personalizado', value: 'custom', icon: DateRangeIcon },
];

const IngresosTable = ({ ingresos, filters, onFilterChange, onEdit, onDelete }) => {
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [showFilters, setShowFilters] = useState(false);
 const [selectedPreset, setSelectedPreset] = useState('month');
 const [activeFilters, setActiveFilters] = useState(0);

 const handleDatePresetChange = (preset) => {
   setSelectedPreset(preset);
   const now = DateTime.now();
   let startDate, endDate;

   switch (preset) {
     case 'today':
       startDate = now.startOf('day');
       endDate = now.endOf('day');
       break;
     case 'week':
       startDate = now.startOf('week');
       endDate = now.endOf('week');
       break;
     case 'month':
       startDate = now.startOf('month');
       endDate = now.endOf('month');
       break;
     case 'lastMonth':
       startDate = now.minus({ months: 1 }).startOf('month');
       endDate = now.minus({ months: 1 }).endOf('month');
       break;
     default:
       return;
   }

   onFilterChange({
     ...filters,
     startDate,
     endDate
   });
 };

 const handleResetFilters = () => {
   onFilterChange({
     startDate: DateTime.now().startOf('month'),
     endDate: DateTime.now().endOf('month'),
     plataforma: 'all',
     searchTerm: ''
   });
   setSelectedPreset('month');
 };

 const calculateTotals = () => {
   const total = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
   const count = ingresos.length;
   return { total, count };
 };

 const { total, count } = calculateTotals();

 return (
   <Paper 
     sx={{ 
       backgroundColor: '#2C2C2C',
       border: '1px solid rgba(255, 255, 255, 0.1)',
       borderRadius: 2,
       overflow: 'hidden'
     }}
   >
     {/* Header Section */}
     <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <Typography variant="h6" sx={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
         Transacciones
         <Chip 
           label={`${count} registros`} 
           size="small"
           sx={{ 
             backgroundColor: 'rgba(0, 255, 209, 0.1)',
             color: '#00FFD1'
           }}
         />
       </Typography>
       
       <Box sx={{ display: 'flex', gap: 1 }}>
         <Tooltip title="Exportar datos">
           <IconButton 
             sx={{ 
               color: '#00FFD1',
               '&:hover': { backgroundColor: 'rgba(0, 255, 209, 0.1)' }
             }}
           >
             <DownloadIcon />
           </IconButton>
         </Tooltip>
         <Badge 
           badgeContent={activeFilters} 
           color="primary"
           sx={{
             '& .MuiBadge-badge': {
               backgroundColor: '#00FFD1',
               color: '#1E1E1E'
             }
           }}
         >
           <IconButton 
             onClick={() => setShowFilters(!showFilters)}
             sx={{ 
               color: '#00FFD1',
               '&:hover': { backgroundColor: 'rgba(0, 255, 209, 0.1)' }
             }}
           >
             <FilterIcon />
           </IconButton>
         </Badge>
       </Box>
     </Box>

     {/* Filters Section */}
     <Collapse in={showFilters}>
       <Box sx={{ px: 2, pb: 2 }}>
         <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
         
         {/* Date Presets */}
         <Box sx={{ mb: 2 }}>
           <ButtonGroup 
             variant="outlined" 
             sx={{ 
               '& .MuiButton-root': {
                 borderColor: 'rgba(0, 255, 209, 0.3)',
                 color: '#FFFFFF',
                 '&:hover': {
                   borderColor: '#00FFD1',
                   backgroundColor: 'rgba(0, 255, 209, 0.1)'
                 },
                 '&.active': {
                   backgroundColor: '#00FFD1',
                   color: '#1E1E1E',
                   '&:hover': {
                     backgroundColor: '#00CCB7'
                   }
                 }
               }
             }}
           >
             {DATE_PRESETS.map(preset => {
               const Icon = preset.icon;
               return (
                 <Button
                   key={preset.value}
                   onClick={() => handleDatePresetChange(preset.value)}
                   className={selectedPreset === preset.value ? 'active' : ''}
                   startIcon={<Icon />}
                 >
                   {preset.label}
                 </Button>
               );
             })}
           </ButtonGroup>
         </Box>

         {/* Custom Date Range */}
         <Box sx={{ 
           display: 'flex', 
           gap: 2, 
           flexWrap: 'wrap',
           alignItems: 'flex-start'
         }}>
           <TextField
             type="datetime-local"
             label="Fecha Inicio"
             value={filters.startDate ? filters.startDate.toFormat("yyyy-MM-dd'T'HH:mm") : ''}
             onChange={(e) => onFilterChange({
               ...filters,
               startDate: DateTime.fromISO(e.target.value)
             })}
             InputLabelProps={{ shrink: true }}
             sx={{
               '& label': { color: '#FFFFFF' },
               '& .MuiOutlinedInput-root': {
                 color: '#FFFFFF',
                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                 '&:hover fieldset': { borderColor: '#FFFFFF' },
                 '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
               },
             }}
           />

           <TextField
             type="datetime-local"
             label="Fecha Fin"
             value={filters.endDate ? filters.endDate.toFormat("yyyy-MM-dd'T'HH:mm") : ''}
             onChange={(e) => onFilterChange({
               ...filters,
               endDate: DateTime.fromISO(e.target.value)
             })}
             InputLabelProps={{ shrink: true }}
             sx={{
               '& label': { color: '#FFFFFF' },
               '& .MuiOutlinedInput-root': {
                 color: '#FFFFFF',
                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                 '&:hover fieldset': { borderColor: '#FFFFFF' },
                 '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
               },
             }}
           />

           <FormControl sx={{ minWidth: 200 }}>
             <InputLabel sx={{ color: '#FFFFFF' }}>Plataforma</InputLabel>
             <Select
               value={filters.plataforma}
               onChange={(e) => onFilterChange({ ...filters, plataforma: e.target.value })}
               label="Plataforma"
               sx={{
                 color: '#FFFFFF',
                 '& .MuiOutlinedInput-notchedOutline': {
                   borderColor: 'rgba(255, 255, 255, 0.23)'
                 },
                 '&:hover .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#FFFFFF'
                 },
                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#00FFD1'
                 }
               }}
             >
               <MenuItem value="all">Todas las plataformas</MenuItem>
               {PLATAFORMAS.map((plataforma) => (
                 <MenuItem key={plataforma} value={plataforma}>
                   {plataforma}
                 </MenuItem>
               ))}
             </Select>
           </FormControl>

           <TextField
             placeholder="Buscar por concepto..."
             value={filters.searchTerm}
             onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
             InputProps={{
               startAdornment: <SearchIcon sx={{ color: '#AAAAAA', mr: 1 }} />
             }}
             sx={{
               minWidth: 250,
               '& .MuiOutlinedInput-root': {
                 color: '#FFFFFF',
                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                 '&:hover fieldset': { borderColor: '#FFFFFF' },
                 '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
               },
             }}
           />

           <Button
             startIcon={<ResetIcon />}
             onClick={handleResetFilters}
             sx={{
               color: '#FFFFFF',
               borderColor: 'rgba(255, 255, 255, 0.23)',
               '&:hover': {
                 borderColor: '#FFFFFF',
                 backgroundColor: 'rgba(255, 255, 255, 0.05)'
               }
             }}
           >
             Resetear filtros
           </Button>
         </Box>
       </Box>
     </Collapse>

     {/* Summary Bar */}
     <Box sx={{ 
       px: 2, 
       py: 1.5, 
       backgroundColor: 'rgba(0, 255, 209, 0.05)',
       borderTop: '1px solid rgba(255, 255, 255, 0.1)',
       borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
       display: 'flex',
       alignItems: 'center',
       gap: 3
     }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         <TrendingUpIcon sx={{ color: '#00FFD1' }} />
         <Typography sx={{ color: '#FFFFFF' }}>
           Total: <strong style={{ color: '#00FFD1' }}>${total.toLocaleString()}</strong>
         </Typography>
       </Box>
       <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
       <Typography sx={{ color: '#AAAAAA' }}>
         Mostrando {Math.min(rowsPerPage, ingresos.length)} de {ingresos.length} transacciones
       </Typography>
     </Box>

     {/* Table */}
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow sx={{ 
             backgroundColor: 'rgba(0, 0, 0, 0.2)',
             '& th': { fontWeight: 600 }
           }}>
             <TableCell sx={{ color: '#FFFFFF' }}>Fecha</TableCell>
             <TableCell sx={{ color: '#FFFFFF' }}>Concepto</TableCell>
             <TableCell sx={{ color: '#FFFFFF' }}>Monto</TableCell>
             <TableCell sx={{ color: '#FFFFFF' }}>Plataforma</TableCell>
             <TableCell sx={{ color: '#FFFFFF' }}>Acciones</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {ingresos
             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             .map((ingreso) => (
               <TableRow 
                 key={ingreso.id}
                 sx={{ 
                   '&:hover': { 
                     backgroundColor: 'rgba(0, 255, 209, 0.05)',
                   }
                 }}
               >
                 <TableCell 
                   sx={{ 
                     color: '#FFFFFF',
                     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   {DateTime.fromISO(ingreso.fecha).toFormat('dd/MM/yyyy HH:mm')}
                 </TableCell>
                 <TableCell 
                   sx={{ 
                     color: '#FFFFFF',
                     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   {ingreso.concepto}
                 </TableCell>
                 <TableCell 
                   sx={{ 
                     color: '#00FFD1',
                     fontWeight: 500,
                     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   ${ingreso.monto.toLocaleString()}
                 </TableCell>
                 <TableCell 
                   sx={{ 
                     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   <Chip
                     label={ingreso.plataforma}
                     sx={{
                       backgroundColor: `${PLATAFORMA_COLORS[ingreso.plataforma]}20`,
                       color: PLATAFORMA_COLORS[ingreso.plataforma],
                       fontWeight: 500,
                       '&:hover': {
                         backgroundColor: `${PLATAFORMA_COLORS[ingreso.plataforma]}30`,
                       }
                     }}
                   />
                 </TableCell>
                 <TableCell 
                   sx={{ 
                     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   <Box sx={{ display: 'flex', gap: 1 }}>
                     <Tooltip title="Editar">
                       <IconButton
                         onClick={() => onEdit(ingreso)}
                         sx={{ 
                           color: '#00FFD1',
                           '&:hover': { backgroundColor: 'rgba(0, 255, 209, 0.1)' }
                         }}
                       >
                         <EditIcon fontSize="small" />
                       </IconButton>
                     </Tooltip>
                     <Tooltip title="Eliminar">
                       <IconButton
                         onClick={() => onDelete(ingreso.id)}
                         sx={{ 
                           color: '#f44336',
                           '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                         }}
                       >
                         <DeleteIcon fontSize="small" />
                       </IconButton>
                     </Tooltip>
                   </Box>
                 </TableCell>
               </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>

     {/* Pagination */}
     <TablePagination
       rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
       component="div"
       count={ingresos.length}
       rowsPerPage={rowsPerPage}
       page={page}
       onPageChange={(event, newPage) => setPage(newPage)}
       onRowsPerPageChange={(event) => {
         setRowsPerPage(parseInt(event.target.value, 10));
         setPage(0);
       }}
       sx={{
         color: '#FFFFFF',
         borderTop: '1px solid rgba(255, 255, 255, 0.1)',
         '.MuiTablePagination-select': {
           color: '#FFFFFF',
         },
         '.MuiTablePagination-selectIcon': {
           color: '#FFFFFF',
         },
         '.MuiTablePagination-displayedRows': {
           color: '#FFFFFF',
         },
         '.MuiTablePagination-actions': {
           color: '#FFFFFF',
           '& button': {
             color: '#FFFFFF',
             '&.Mui-disabled': {
               color: 'rgba(255, 255, 255, 0.3)',
             }
           }
         }
       }}
     />
   </Paper>
 );
};

export default IngresosTable;
import React from 'react';
import {
  Box,
  ButtonBase,
  Typography,
  Popover,
  Paper,
  IconButton,
  Grid
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';

const QuickMonthFilter = ({ onSelectMonth }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(DateTime.now().year);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMonthSelect = (month) => {
    const selectedDate = DateTime.fromObject({ year: selectedYear, month });
    onSelectMonth({
      startDate: selectedDate.startOf('month'),
      endDate: selectedDate.endOf('month')
    });
    handleClose();
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = DateTime.fromObject({ month: i + 1 });
    return {
      number: i + 1,
      name: date.toFormat('MMM')
    };
  });

  const open = Boolean(anchorEl);

  return (
    <>
      <ButtonBase
        onClick={handleClick}
        sx={{
          bgcolor: 'rgba(0, 255, 209, 0.1)',
          borderRadius: 2,
          p: 1,
          px: 2,
          color: '#00FFD1',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(0, 255, 209, 0.2)',
          }
        }}
      >
        <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
        <Typography variant="body2">
          Filtrar por Mes
        </Typography>
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            bgcolor: '#2C2C2C',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            mt: 1,
            width: 280
          }
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: 'transparent',
            p: 2
          }}
        >
          {/* Year Selector */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}>
            <IconButton 
              onClick={() => setSelectedYear(prev => prev - 1)}
              sx={{ color: '#FFFFFF' }}
            >
              <PrevIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFFFFF',
                fontWeight: 500
              }}
            >
              {selectedYear}
            </Typography>
            <IconButton 
              onClick={() => setSelectedYear(prev => prev + 1)}
              sx={{ color: '#FFFFFF' }}
            >
              <NextIcon />
            </IconButton>
          </Box>

          {/* Months Grid */}
          <Grid container spacing={1}>
            {months.map((month) => (
              <Grid item xs={4} key={month.number}>
                <ButtonBase
                  onClick={() => handleMonthSelect(month.number)}
                  sx={{
                    width: '100%',
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 209, 0.1)',
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#FFFFFF',
                      fontWeight: month.number === DateTime.now().month ? 600 : 400
                    }}
                  >
                    {month.name}
                  </Typography>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popover>
    </>
  );
};

export default QuickMonthFilter;
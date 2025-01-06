import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography 
} from '@mui/material';
import Ingresos from './components/Ingresos/Ingresos';
import Egresos from './components/Egresos/Egresos';
import Resultados from './components/Resultados/Resultados';
import Data from './components/Data/Data';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financiera-tabpanel-${index}`}
      aria-labelledby={`financiera-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const FinancieraPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#1E1E1E', minHeight: '100vh' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(0, 255, 209, 0.1)' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#00FFD1',
            },
            '& .MuiTab-root': {
              color: '#FFFFFF',
              '&.Mui-selected': {
                color: '#00FFD1',
              },
            },
          }}
        >
          <Tab 
            label={
              <Typography sx={{ 
                fontSize: '1rem',
                fontWeight: currentTab === 0 ? 600 : 400,
                textTransform: 'none',
              }}>
                Ingresos
              </Typography>
            } 
          />
          <Tab 
            label={
              <Typography sx={{ 
                fontSize: '1rem',
                fontWeight: currentTab === 1 ? 600 : 400,
                textTransform: 'none',
              }}>
                Egresos
              </Typography>
            } 
          />
          <Tab 
            label={
              <Typography sx={{ 
                fontSize: '1rem',
                fontWeight: currentTab === 2 ? 600 : 400,
                textTransform: 'none',
              }}>
                Resultados
              </Typography>
            } 
          />
          <Tab 
            label={
              <Typography sx={{ 
                fontSize: '1rem',
                fontWeight: currentTab === 3 ? 600 : 400,
                textTransform: 'none',
              }}>
                Data
              </Typography>
            } 
          />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Ingresos />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Egresos />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <Resultados />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <Data />
      </TabPanel>
    </Box>
  );
};

export default FinancieraPage;
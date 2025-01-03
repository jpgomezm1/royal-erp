import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography 
} from '@mui/material';
import LeadTracker from './components/LeadTracker/LeadTracker';
import CRM from './components/CRM/CRM'
import MetricasComerciales from './components/MetricasComerciales/MetricasComerciales';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comercial-tabpanel-${index}`}
      aria-labelledby={`comercial-tab-${index}`}
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

const ComercialPage = () => {
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
                Lead Tracker
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
                CRM
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
                Métricas Comerciales
              </Typography>
            } 
          />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <LeadTracker />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <CRM />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <MetricasComerciales />
      </TabPanel>
    </Box>
  );
};

export default ComercialPage;
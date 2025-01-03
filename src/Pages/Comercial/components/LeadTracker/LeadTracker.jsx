import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import NewLeadDialog from './components/NewLeadDialog';
import LogDialog from './components/LogDialog';
import LeadTable from './components/LeadTable';
import PipelineOverview from './components/PipelineOverview';
import RemindersCard from './components/RemindersCard';

const LeadTracker = () => {
  const [leads, setLeads] = useState([]);
  const [openNewLeadDialog, setOpenNewLeadDialog] = useState(false);
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  const handleAddNewLead = (newLead) => {
    setLeads([...leads, { ...newLead, id: Date.now() }]);
    setOpenNewLeadDialog(false);
  };

  const handleAddLog = (leadId, newLog) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          logs: [...lead.logs, newLog],
          reminders: newLog.reminderDate 
            ? [...lead.reminders, {
                date: newLog.reminderDate,
                action: newLog.nextAction,
                completed: false,
                id: Date.now()
              }]
            : lead.reminders
        };
      }
      return lead;
    }));
    setOpenLogDialog(false);
  };

  const handleOpenLogDialog = (lead) => {
    setCurrentLead(lead);
    setOpenLogDialog(true);
  };

  const handleUpdateLeadStage = (leadId, newStage) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ));
  };

  const handleCompleteReminder = (leadId, reminderId) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          reminders: lead.reminders.map(reminder => 
            reminder.id === reminderId 
              ? { ...reminder, completed: true }
              : reminder
          )
        };
      }
      return lead;
    }));
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h5" sx={{ color: '#FFFFFF' }}>
          Lead Tracker
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewLeadDialog(true)}
          sx={{
            backgroundColor: '#00FFD1',
            color: '#1E1E1E',
            '&:hover': {
              backgroundColor: '#00CCB7',
            },
          }}
        >
          Nuevo Lead
        </Button>
      </Box>

      {/* Reminders Section */}
      <RemindersCard 
        leads={leads}
        onComplete={handleCompleteReminder}
      />

      {/* Pipeline Overview */}
      <PipelineOverview leads={leads} />

      {/* Leads Table */}
      <LeadTable 
        leads={leads}
        onOpenLog={handleOpenLogDialog}
        onUpdateStage={handleUpdateLeadStage}
      />

      {/* Dialogs */}
      <NewLeadDialog
        open={openNewLeadDialog}
        onClose={() => setOpenNewLeadDialog(false)}
        onSave={handleAddNewLead}
      />

      <LogDialog
        open={openLogDialog}
        lead={currentLead}
        onClose={() => setOpenLogDialog(false)}
        onSave={handleAddLog}
      />
    </Box>
  );
};

export default LeadTracker;
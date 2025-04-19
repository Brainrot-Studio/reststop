import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const METHOD_COLORS = {
  GET: 'success',
  POST: 'primary',
  PUT: 'warning',
  DELETE: 'error',
  PATCH: 'secondary'
};

export default function HistorySidebar({ history, onClick }) {
  return (
    <Box sx={{
      width: 300,
      bgcolor: '#1e1e1e',
      color: 'white',
      borderRight: '1px solid #333',
      height: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
        <Typography variant="h6">
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          History
        </Typography>
      </Box>

      <List dense disablePadding sx={{ flexGrow: 1 }}>
        {history.map((item, idx) => (
          <Tooltip key={idx} title={`${item.req.method} ${item.req.url}`} arrow placement="right">
            <ListItemButton
              onClick={() => onClick(item)}
              sx={{
                px: 2,
                py: 1.5,
                '&:hover': { bgcolor: '#2a2a2a' },
                alignItems: 'flex-start'
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, pr: 1 }}>
                <Chip
                  label={item.req.method}
                  color={METHOD_COLORS[item.req.method] || 'default'}
                  size="small"
                  sx={{ fontWeight: 700, height: 20 }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                secondaryTypographyProps={{ fontSize: 12, color: 'gray' }}
                primary={item.req.url}
                secondary={new Date(item.date).toLocaleTimeString()}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
}

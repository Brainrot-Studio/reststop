// src/renderer/src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Paper,
  Tooltip,
  IconButton,
  createTheme,
  ThemeProvider
} from '@mui/material';
import MonacoJsonEditor from '../components/MonacoJsonEditor';

const drawerWidth = 300;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0'
    }
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#ffffff'
        },
        root: {
          backgroundColor: '#1e1e1e'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#555'
        }
      }
    }
  }
});

export default function App() {
  const [requestTab, setRequestTab] = useState(0);
  const [responseTab, setResponseTab] = useState(0);
  const [history, setHistory] = useState([]);
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [responseHeaders, setResponseHeaders] = useState('');
  const [responseTime, setResponseTime] = useState(null);

  useEffect(() => {
    const data = window.RESTStopAPI?.getHistory?.();
    if (data) setHistory(data);
  }, []);

  const tryParseJson = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };

  const handlePrettify = (target) => {
    try {
      if (target === 'headers') setHeaders(JSON.stringify(JSON.parse(headers), null, 2));
      if (target === 'body') setBody(JSON.stringify(JSON.parse(body), null, 2));
    } catch (err) {
      alert('Invalid JSON');
    }
  };

  const handleSend = async () => {
    const start = performance.now();
    const result = await window.RequestAPI?.sendRequest({
      url,
      method,
      headers: tryParseJson(headers) || {},
      body: tryParseJson(body) || {}
    });
    const duration = Math.round(performance.now() - start);
    setResponseTime(duration);

    if (result.success) {
      setResponse(result.data);
      setResponseHeaders(JSON.stringify(result.headers, null, 2));
      const newEntry = { url, method, headers, body };
      window.RESTStopAPI?.saveToHistory?.(newEntry);
      setHistory([newEntry, ...history]);
    } else {
      setResponse({ error: result.error });
      setResponseHeaders('');
    }
  };

  const loadFromHistory = (entry) => {
    setUrl(entry.url);
    setMethod(entry.method);
    setHeaders(entry.headers);
    setBody(entry.body);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', bgcolor: 'background.default', color: 'text.primary', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Box
          sx={{
            width: drawerWidth,
            minWidth: drawerWidth,
            bgcolor: 'background.paper',
            p: 2,
            overflowY: 'auto',
            borderRight: '1px solid #333'
          }}
        >
          <Typography variant="h6" mb={2}>History</Typography>
          <List>
            {history.map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemButton onClick={() => loadFromHistory(item)}>
                  <ListItemText primary={`${item.method} ${item.url}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', p: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={4}>🚏 RESTStop</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="URL"
              variant="outlined"
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ height: '35%', p: 2, overflow: 'auto' }}>
            <Tabs value={requestTab} onChange={(e, newVal) => setRequestTab(newVal)}>
              <Tab label="Headers" />
              <Tab label="Body" />
            </Tabs>
            {requestTab === 0 && (
              <Box sx={{ position: 'relative', mb: 2, height: '100%' }}>
                <MonacoJsonEditor value={headers} onChange={setHeaders} height="100%" />
              </Box>
            )}
            {requestTab === 1 && (
              <Box sx={{ position: 'relative', mb: 2, height: '100%' }}>
                <MonacoJsonEditor value={body} onChange={setBody} height="100%" />
              </Box>
            )}
          </Box>

          <Button variant="contained" color="success" onClick={handleSend} sx={{ mb: 4, alignSelf: 'flex-start' }}>
            Send Request
          </Button>

          <Paper elevation={3} sx={{ height: '40%', p: 2, bgcolor: 'background.paper', overflow: 'auto' }}>
            <Tabs value={responseTab} onChange={(e, newVal) => setResponseTab(newVal)}>
              <Tab label="Response" />
              <Tab label="Headers" />
            </Tabs>

            {responseTab === 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  ⏱ {responseTime ? `${responseTime} ms` : 'n/a'}
                </Typography>
                <MonacoJsonEditor value={JSON.stringify(response, null, 2)} height="200px" readOnly={true} />
              </Box>
            )}

            {responseTab === 1 && (
              <Box mt={2}>
                <MonacoJsonEditor value={JSON.stringify(responseHeaders, null, 2)} height="200px" readOnly={true} />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
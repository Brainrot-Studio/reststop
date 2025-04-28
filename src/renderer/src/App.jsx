// src/renderer/src/App.jsx
import React, { useEffect, useState } from 'react'; // <-- removed useRef
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Paper,
  createTheme,
  ThemeProvider
} from '@mui/material';
import MonacoJsonEditor from '../components/MonacoJsonEditor';
import HistorySidebar from '../components/HistorySidebar';

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
    async function fetchData() {
      const data = await window.DatabaseAPI?.getHistory?.() || [];
      console.log(`data: ${JSON.stringify(data)}`);
      if (data) setHistory(data);
    }
    fetchData();
  }, []);

  const tryParseJson = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return str;
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
      const newEntry = { 
        date: new Date(), 
        req: { url, method, headers, body }, 
        res: { status: result.status, duration: result.duration, headers: result.headers, body: result.data, statusText: result.statusText }
      };
      window.DatabaseAPI?.addHistory?.(newEntry);
      setHistory([newEntry, ...history]);
    } else {
      const newEntry = { 
        date: new Date(), 
        req: { url, method, headers, body }, 
        res: { status: result.status, duration: result.duration, headers: '', body: result.error, statusText: '' }
      };
      window.DatabaseAPI?.addHistory?.(newEntry);
      setHistory([newEntry, ...history]);
      setResponse({ error: result.error });
      setResponseHeaders('');
    }
  };

  const loadFromHistory = (entry) => {
    setUrl(entry.req.url);
    setMethod(entry.req.method);
    setHeaders(entry.req.headers);
    setBody(entry.req.body);
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
            borderRight: '1px solid #333',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <HistorySidebar history={history} onClick={loadFromHistory} />
        </Box>

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', p: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
            {/* Clean static logo */}
            <Box 
              sx={{ 
                width: { xs: 32, sm: 40 }, 
                height: { xs: 32, sm: 40 }, 
                mr: 2, 
                bgcolor: 'transparent', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img 
                src="../public/reststopsign.png" 
                alt="RESTStop Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }}
              />
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.2rem' } }}>
              RESTStop
            </Typography>
          </Box>

          {/* URL and Method */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="URL"
              variant="outlined"
              size="small"
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              size="small"
              sx={{ minWidth: { xs: 80, sm: 120 } }}
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </Box>

          {/* Request Editors */}
          <Box sx={{ height: { xs: '30vh', sm: '35vh' }, minHeight: '150px', p: 1, overflow: 'auto' }}>
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

          {/* Send Request Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1.5, mb: 2, mx: 1 }}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleSend} 
              size="small"
              sx={{ 
                px: { xs: 2, sm: 3 },
                py: { xs: 0.8, sm: 1.2 },
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Send Request
            </Button>
          </Box>

          {/* Response Viewer */}
          <Paper elevation={3} sx={{ height: { xs: '30vh', sm: '30vh' }, minHeight: '150px', p: 1, bgcolor: 'background.paper', overflow: 'auto' }}>
            <Tabs value={responseTab} onChange={(e, newVal) => setResponseTab(newVal)}>
              <Tab label="Response" />
              <Tab label="Headers" />
            </Tabs>

            {responseTab === 0 && (
              <Box sx={{ position: 'relative', mb: 2, height: '75%' }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  ⏱ {responseTime ? `${responseTime} ms` : 'n/a'}
                </Typography>
                <MonacoJsonEditor value={JSON.stringify(response, null, 2)} height="100%" readOnly={true} />
              </Box>
            )}
            {responseTab === 1 && (
              <Box sx={{ position: 'relative', mb: 2, height: '75%' }}>
                <MonacoJsonEditor value={JSON.stringify(responseHeaders, null, 2)} height="100%" readOnly={true} />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
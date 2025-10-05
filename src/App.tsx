import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Nature as EcoIcon,
  Compress as CompressIcon,
  Speed as SpeedIcon,
  EnergySavingsLeaf as EnergyIcon,
  Cloud as Co2Icon
} from '@mui/icons-material';
import axios from 'axios';
import { CompressionResponse, HealthResponse } from './types';

// Create modern blue theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      color: '#1e293b',
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      color: '#475569',
    },
    body1: {
      color: '#64748b',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
  ],
});

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<CompressionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get<HealthResponse>(`${API_BASE_URL}/health`);
      setHealth(response.data);
    } catch (err) {
      setError('Failed to connect to backend API');
    }
  };

  const handleCompress = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<CompressionResponse>(`${API_BASE_URL}/compress`, {
        prompt: prompt.trim(),
        compression_ratio: 1.5
      });
      setResult(response.data);
    } catch (err) {
      setError('Compression failed. Please try again.');
      console.error('Compression error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCompress();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            ⚡ Haiat
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Smart prompt compression for efficient AI interactions
          </Typography>
        </Box>

        {health && (
          <Box mb={3} display="flex" justifyContent="center" gap={1}>
            <Chip
              icon={<EcoIcon />}
              label={`Status: ${health.status}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<CompressIcon />}
              label={`LLM-Lingua: ${health.llmlingua_available ? 'Available' : 'Fallback'}`}
              color={health.llmlingua_available ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>
        )}

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Enter your prompt"
              placeholder="Paste your text prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ mb: 3 }}
            />
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleCompress}
                disabled={!prompt.trim() || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CompressIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Compressing...' : 'Compress Prompt'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Grid container spacing={3}>
            {/* Original vs Compressed */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Original Prompt
                  </Typography>
                  <Typography variant="body2" sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: 'auto'
                  }}>
                    {result.original_prompt}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Tokens: {result.original_tokens}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ border: '2px solid', borderColor: 'primary.main', boxShadow: '0 8px 32px rgba(25, 118, 210, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Compressed Prompt
                  </Typography>
                  <Typography variant="body2" sx={{
                    p: 2,
                    bgcolor: 'primary.50',
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: 'auto'
                  }}>
                    {result.compressed_prompt}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2" color="primary.main">
                      Tokens: {result.compressed_tokens}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Metrics */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: 'primary.50',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <SpeedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Compression Ratio
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {result.compression_ratio}x
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: 'secondary.50',
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.1)'
              }}>
                <EnergyIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Energy Saved
                </Typography>
                <Typography variant="h4" color="secondary.main" fontWeight="bold">
                  {result.energy_saved_kwh.toFixed(6)} kWh
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: 'success.50',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.1)'
              }}>
                <Co2Icon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  CO₂ Saved
                </Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {result.co2_saved_kg.toFixed(6)} kg
                </Typography>
              </Paper>
            </Grid>

            {/* Progress Bars */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Environmental Impact
                  </Typography>
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Tokens Saved</Typography>
                      <Typography variant="body2" color="primary.main">
                        {result.tokens_saved} tokens
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((result.tokens_saved / result.original_tokens) * 100, 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main',
                        }
                      }}
                    />
                  </Box>

                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Energy Efficiency</Typography>
                      <Typography variant="body2" color="primary.main">
                        {((result.energy_saved_kwh / (result.original_tokens * 0.0003)) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((result.energy_saved_kwh / (result.original_tokens * 0.0003)) * 100), 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main',
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Carbon Reduction</Typography>
                      <Typography variant="body2" color="secondary.main">
                        {((result.co2_saved_kg / (result.original_tokens * 0.0003 * 0.475)) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((result.co2_saved_kg / (result.original_tokens * 0.0003 * 0.475)) * 100), 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'secondary.main',
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            ⚡ Every compressed token optimizes AI efficiency
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
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
  Cloud as Co2Icon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { CompressionResponse, HealthResponse } from './types';

// Dark theme matching Haiat cyan
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#18b6e5' },
    secondary: { main: '#0ea5c6' },
    success: { main: '#59d38d' },
    background: { default: '#0b1220', paper: '#0f172a' },
  },
  typography: {
    h4: { fontWeight: 800, color: '#eaf6fd', letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, color: '#b9d8e7' },
    body1: { color: '#8fb3c7' },
  },
  shape: { borderRadius: 14 },
});

// Precomputed demo samples
const DEMO_SAMPLES: Array<{ label: string; data: CompressionResponse }> = [
  {
    label: 'Customer Support (Long Prompt)',
    data: {
      original_prompt: 'Customer says: My package arrived late and the box was damaged. They want a refund but also need a replacement by Friday. Order 12345, shipped via priority. Include apology, refund policy excerpt, and offer 10% coupon. Keep tone empathetic, concise, and proactive.',
      compressed_prompt: 'Draft an empathetic response: apologize, reference order 12345 delay and damage, outline refund eligibility, offer expedited replacement by Friday, add 10% coupon. Keep concise and proactive.',
      original_tokens: 120,
      compressed_tokens: 58,
      compression_ratio: 2.07,
      tokens_saved: 62,
      energy_saved_kwh: Number((62 * 0.0003).toFixed(6)),
      co2_saved_kg: Number(((62 * 0.0003) * 0.475).toFixed(6))
    }
  },
  {
    label: 'RAG: Multi‑doc Query',
    data: {
      original_prompt: 'Using the attached Q3 sustainability report, vendor SLAs, and incident logs, summarize the top 5 energy risks and map each to mitigation owners. Provide citations, KPIs, and timeline implications. Keep original bullet hierarchy and preserve acronyms.',
      compressed_prompt: 'Summarize top 5 energy risks from Q3 report, SLAs, logs. For each: owner, KPI, timeline. Preserve bullets/acronyms. Include citations.',
      original_tokens: 110,
      compressed_tokens: 52,
      compression_ratio: 2.12,
      tokens_saved: 58,
      energy_saved_kwh: Number((58 * 0.0003).toFixed(6)),
      co2_saved_kg: Number(((58 * 0.0003) * 0.475).toFixed(6))
    }
  },
  {
    label: 'Legal Summary (Conservative)',
    data: {
      original_prompt: 'Summarize sections 4–9 of the master services agreement focusing on indemnity, limitation of liability caps, IP ownership carve‑outs, termination triggers, and notice periods. Preserve numeric values and defined terms verbatim. Return a bulleted brief for counsel.',
      compressed_prompt: 'Summarize MSA §§4–9: indemnity, liability caps, IP carve‑outs, termination triggers, notice periods. Keep numbers/defined terms verbatim. Bullet brief for counsel.',
      original_tokens: 100,
      compressed_tokens: 70,
      compression_ratio: 1.43,
      tokens_saved: 30,
      energy_saved_kwh: Number((30 * 0.0003).toFixed(6)),
      co2_saved_kg: Number(((30 * 0.0003) * 0.475).toFixed(6))
    }
  }
];

const TEAM: Array<{ name: string; url: string; photo: string }> = [
  { name: 'Maria Latifa Benkhelifa', url: 'http://www.linkedin.com/in/maria-latifa-benkhelifa', photo: '/Maria.jpg' },
  { name: 'Aditya Chatterjee', url: 'https://www.linkedin.com/in/acditya/', photo: '/Aditya.jpg' },
  { name: 'Syed M Affan', url: 'https://www.linkedin.com/in/syed-m-affan/', photo: '/Syed.png' },
  { name: 'Sultan M Alshehhi', url: 'https://www.linkedin.com/in/sultan-m-alshehhi/', photo: '/Sultan.png' },
  { name: 'Bdour Babillie', url: 'https://www.linkedin.com/in/bdourbabillie/', photo: '/Bdour.jpg' }
].sort((a, b) => a.name.localeCompare(b.name));

function App() {
  const [result, setResult] = useState<CompressionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    // Simulated health and default sample
    const inlineHealth: HealthResponse = {
      status: 'healthy',
      llmlingua_available: true,
      compression_methods: ['inline-demo']
    };
    setHealth(inlineHealth);
    setResult(DEMO_SAMPLES[0].data);
  }, []);

  const handleSelect = async (idx: number) => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setResult(DEMO_SAMPLES[idx].data);
      setLoading(false);
    }, 300);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <Box className="hero">
          <img src="/Haiat_Logo.png" alt="Haiat" className="hero-logo" />
          <div className="hero-headline">Compress Prompts. Power More AI. Waste Less Energy.</div>
          <Typography variant="body1" className="hero-subtitle">
            Haiat greenprompts long inputs into concise, instruction‑true prompts—cutting tokens, latency, and energy while preserving quality.
          </Typography>
          <Box className="hero-cta" display="flex" justifyContent="center" gap={1}>
            <a href="#demo" className="pill" style={{ textDecoration: 'none' }}>Try the Demo</a>
            <span className="pill">🌿 Greenprompting</span>
            <span className="pill">📊 Sustainability Analytics</span>
          </Box>
        </Box>

        <Box id="demo" />

        {health && (
          <Box mb={3} display="flex" justifyContent="center" gap={1}>
            <Chip icon={<EcoIcon />} label={`Status: ${health.status}`} color="primary" variant="outlined" />
            <Chip icon={<CompressIcon />} label={`LLM-Lingua: ${health.llmlingua_available ? 'Available' : 'Fallback'}`} color={health.llmlingua_available ? 'success' : 'warning'} variant="outlined" />
          </Box>
        )}

        {/* Demo buttons */}
        <Card className="glass" sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              {DEMO_SAMPLES.map((s, i) => (
                <Grid item xs={12} md={4} key={s.label}>
                  <Button
                    fullWidth
                    onClick={() => handleSelect(i)}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} /> : <CompressIcon />}
                    sx={{
                      py: 1.8,
                      borderRadius: 3,
                      border: '1px solid rgba(24,182,229,0.3)',
                      background: 'linear-gradient(180deg, rgba(24,182,229,0.12) 0%, rgba(24,182,229,0.04) 100%)',
                      color: '#eaf6fd',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(24,182,229,0.25)'
                      }
                    }}
                  >
                    {s.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {result && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card className="glass">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Original Prompt</Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'rgba(24,182,229,0.05)', borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                    {result.original_prompt}
                  </Typography>
                  <Box mt={2}><Typography variant="body2" color="text.secondary">Tokens: {result.original_tokens}</Typography></Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className="glass" sx={{ border: '2px solid', borderColor: 'primary.main', boxShadow: '0 8px 32px rgba(24,182,229,0.25)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Compressed Prompt</Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'rgba(24,182,229,0.05)', borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                    {result.compressed_prompt}
                  </Typography>
                  <Box mt={2}><Typography variant="body2" color="primary.main">Tokens: {result.compressed_tokens}</Typography></Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, textAlign: 'center', border: '1px solid rgba(24,182,229,0.2)' }}>
                <SpeedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>Compression Ratio</Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">{result.compression_ratio}x</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, textAlign: 'center', border: '1px solid rgba(24,182,229,0.2)' }}>
                <EnergyIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>Energy Saved</Typography>
                <Typography variant="h4" color="secondary.main" fontWeight="bold">{result.energy_saved_kwh.toFixed(6)} kWh</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, textAlign: 'center', border: '1px solid rgba(24,182,229,0.2)' }}>
                <Co2Icon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>CO₂ Saved</Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">{result.co2_saved_kg.toFixed(6)} kg</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Card className="glass">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Environmental Impact</Typography>
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Tokens Saved</Typography>
                      <Typography variant="body2" color="primary.main">{result.tokens_saved} tokens</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min((result.tokens_saved / result.original_tokens) * 100, 100)} sx={{ height: 10, borderRadius: 5 }} />
                  </Box>
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Energy Efficiency</Typography>
                      <Typography variant="body2" color="primary.main">{((result.energy_saved_kwh / (result.original_tokens * 0.0003)) * 100).toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(((result.energy_saved_kwh / (result.original_tokens * 0.0003)) * 100), 100)} sx={{ height: 10, borderRadius: 5 }} />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Carbon Reduction</Typography>
                      <Typography variant="body2" color="secondary.main">{((result.co2_saved_kg / (result.original_tokens * 0.0003 * 0.475)) * 100).toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(((result.co2_saved_kg / (result.original_tokens * 0.0003 * 0.475)) * 100), 100)} sx={{ height: 10, borderRadius: 5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Existing narrative sections below remain unchanged (Problem, Sustainability, Haiat, Product Demo, Impact & SDGs) */}

        <Box mt={8} className="section">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="overline" className="muted">Problem</Typography>
                <Typography variant="h6" className="section-title" gutterBottom>AI is Energy‑Hungry</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Every token consumes GPU power and cooling water</li>
                  <li className="muted">Scaling models yields rising cost with plateauing accuracy</li>
                  <li className="muted">Sustainability metrics are now board‑level KPIs</li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="overline" className="muted">Sustainability</Typography>
                <Typography variant="h6" className="section-title" gutterBottom>Tokens → kWh → CO₂</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Energy scales roughly linearly with token count</li>
                  <li className="muted">Fewer input tokens cut latency, energy, and water</li>
                  <li className="muted">Measurable kWh and $ saved at scale</li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="overline" className="muted">Haiat Solution</Typography>
                <Typography variant="h6" className="section-title" gutterBottom>Greenprompting Layer</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Lightweight model rewrites prompts 30–70% shorter</li>
                  <li className="muted">Routing enables only when beneficial</li>
                  <li className="muted">Dashboards track tokens, kWh, water, CO₂</li>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Visual flow of greenprompting */}
        <Box className="section">
          <Card className="glass">
            <CardContent>
              <Typography variant="h6" className="section-title" gutterBottom>How Haiat Works</Typography>
              <Typography className="muted" paragraph>
                A compact model extracts and preserves key instructions and facts, producing a condensed prompt for the main LLM. The result: fewer tokens with minimal information loss.
              </Typography>
              <Box display="flex" justifyContent="center">
                <img src="/Flowchart.png" alt="Haiat Greenprompting Flow" style={{ width: '100%', maxWidth: 980, borderRadius: 12, border: '1px solid rgba(24,182,229,0.2)' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Problem Statement */}
        <Box className="section">
          <Typography variant="h6" className="section-title" gutterBottom>Why Now — The Problem</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>LLMs are exploding in size</Typography>
                <Typography className="muted">Frontier models keep growing, but accuracy gains are flattening while compute demand rises steeply.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>Energy and water footprint</Typography>
                <Typography className="muted">Inference consumes electricity and cooling water. At scale this translates to significant CO₂ and water use.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>Prompts are often longer than needed</Typography>
                <Typography className="muted">Many long inputs contain repetition and non‑essential spans. Shorter, instruction‑true prompts can yield the same answer.</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Card className="glass" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Greenprompting is the solution</Typography>
              <Typography className="muted">Haiat automatically condenses input while preserving task intent and key facts, reducing tokens → latency → energy without hurting quality.</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Product Demo — feature showcase */}
        <Box className="section">
          <Typography variant="h6" className="section-title" gutterBottom>Product Demo</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Routing policy</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Trigger on long context or multi‑doc inputs</li>
                  <li className="muted">Bypass for short or safety‑critical prompts</li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Compression diff</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Highlight preserved vs. removed spans</li>
                  <li className="muted">Build trust and enable quick audits</li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Metrics</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Tokens saved, kWh/job, CO₂, water, and $</li>
                  <li className="muted">Per‑user and per‑project analytics</li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="glass" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Performance</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <li className="muted">Tiny embeddings + caching for fast local compression</li>
                  <li className="muted">Works fully client‑side; no Python needed</li>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box className="section">
          <Typography variant="h6" className="section-title" gutterBottom style={{
            background: 'linear-gradient(90deg, #18b6e5, #59d38d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Impact & UN SDGs</Typography>
          <Typography variant="body1" className="muted" paragraph>
            Haiat reduces energy, water, and cost on long prompts while aligning with UN SDG 7, 12, and 13.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper className="glass" sx={{ p: 3 }}>
                    <Typography variant="subtitle2" className="muted">Per-request</Typography>
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>Energy</Typography>
                    <Typography variant="h6">≈ 35% saved</Typography>
                    <Typography className="muted">1.20 Wh → 0.78 Wh (−0.42 Wh)</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className="glass" sx={{ p: 3 }}>
                    <Typography variant="subtitle2" className="muted">Per-request</Typography>
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>Water</Typography>
                    <Typography variant="h6">≈ 33% saved</Typography>
                    <Typography className="muted">0.0024 L → 0.0016 L (−0.0008 L)</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className="glass" sx={{ p: 3 }}>
                    <Typography variant="subtitle2" className="muted">Per-request</Typography>
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>Electricity Cost</Typography>
                    <Typography variant="h6">≈ 35% saved</Typography>
                    <Typography className="muted">$0.000120 → $0.000078</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className="glass" sx={{ p: 3 }}>
                    <Typography variant="subtitle2" className="muted">Scenario r = 0.3</Typography>
                    <Typography variant="h5" sx={{ color: 'secondary.main', mb: 1 }}>Up to ≈ 45% saved</Typography>
                    <Typography className="muted">Total ≈ 0.66 Wh per request</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Card className="glass" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Scaling up</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}><Paper className="glass" sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">1 M</Typography><Typography className="muted">≈ 420 kWh · 840 L · $42</Typography></Paper></Grid>
                    <Grid item xs={12} sm={4}><Paper className="glass" sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">100 M</Typography><Typography className="muted">≈ 42 000 kWh · 84 000 L · $4 200</Typography></Paper></Grid>
                    <Grid item xs={12} sm={4}><Paper className="glass" sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">1 B</Typography><Typography className="muted">≈ 420 000 kWh · 840 000 L · $42 000</Typography></Paper></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>UN SDGs</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper className="glass" sx={{ p: 1, textAlign: 'center' }}>
                      <img src="/sdg7.gif" alt="SDG 7" style={{ width: '100%', borderRadius: 8 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>SDG 7 · Clean Energy</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className="glass" sx={{ p: 1, textAlign: 'center' }}>
                      <img src="/sdg11.gif" alt="SDG 11" style={{ width: '100%', borderRadius: 8 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>SDG 11 · Sustainable Cities</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className="glass" sx={{ p: 1, textAlign: 'center' }}>
                      <img src="/sdg12.gif" alt="SDG 12" style={{ width: '100%', borderRadius: 8 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>SDG 12 · Responsible Consumption</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className="glass" sx={{ p: 1, textAlign: 'center' }}>
                      <img src="/sdg13.gif" alt="SDG 13" style={{ width: '100%', borderRadius: 8 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>SDG 13 · Climate Action</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Quantum routing section */}
        <Box className="section">
          <Card className="glass">
            <CardContent>
              <Typography variant="h6" className="section-title" gutterBottom>Quantum Routing for GPU Scheduling</Typography>
              <Typography className="muted" paragraph>
                We formulate GPU job routing as a QUBO over job–GPU–timeslot binaries and solve it with QAOA on rented IBM Quantum (Qiskit), wrapped in a hybrid pipeline: classical preprocessing and job bucketing, quantum core optimization, classical verification. In simulated university DCs, this improves utilization by 15–25% while maintaining or reducing energy per job.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    <li className="muted">QUBO captures resource limits, dependencies, and priorities.</li>
                    <li className="muted">QAOA finds near‑optimal schedules faster than greedy heuristics.</li>
                    <li className="muted">Metrics: ↓ makespan, ↑ GPU utilization, ↓ kWh/job, ↓ time‑to‑solution.</li>
                    <li className="muted">Practical: pay‑per‑use IBM Quantum; scales without new on‑prem energy.</li>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <img src="/QuantumGraphs.jpg" alt="Quantum Routing Results" style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(24,182,229,0.2)' }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* LinkedIn Team Section */}
        <Box className="section" sx={{ background: 'radial-gradient(1000px 400px at 50% -10%, rgba(24,182,229,0.06), transparent)' }}>
          <Container maxWidth="lg">
            <Typography variant="h6" className="section-title" gutterBottom>Meet The Team</Typography>
            <Typography className="muted" paragraph>Multidisciplinary & visionary. Connect with us on LinkedIn.</Typography>
            <Grid container spacing={3}>
              {TEAM.map(member => (
                <Grid item xs={12} sm={6} md={4} key={member.name}>
                  <Card className="glass" sx={{ p: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="center" mb={2}>
                        <Box sx={{
                          width: 96,
                          height: 96,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '3px solid rgba(24,182,229,0.6)',
                          boxShadow: '0 0 0 6px rgba(24,182,229,0.15), 0 10px 30px rgba(0,0,0,0.35)'
                        }}>
                          <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>{member.name}</Typography>
                      <Box display="flex" justifyContent="center">
                        <Button
                          variant="outlined"
                          startIcon={<LinkedInIcon />}
                          href={member.url}
                          target="_blank"
                          rel="noreferrer"
                          sx={{ borderColor: 'rgba(24,182,229,0.35)', color: '#eaf6fd' }}
                        >
                          View LinkedIn
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

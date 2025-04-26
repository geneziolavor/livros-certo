import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Páginas
import Home from './pages/Home';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import Livros from './pages/Livros';
import Horarios from './pages/Horarios';
import Lembretes from './pages/Lembretes';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Tema personalizado com cores semelhantes ao site de referência
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Verde como cor principal
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9800', // Laranja como cor secundária
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
    <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/alunos" element={<Alunos />} />
              <Route path="/professores" element={<Professores />} />
              <Route path="/livros" element={<Livros />} />
              <Route path="/horarios" element={<Horarios />} />
              <Route path="/lembretes" element={<Lembretes />} />
            </Routes>
          </main>
          <Footer />
    </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

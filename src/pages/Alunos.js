import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// URL base da API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAluno, setCurrentAluno] = useState({
    nome: '',
    email: '',
    turma: '',
    telefone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carregar alunos do backend ao iniciar
  useEffect(() => {
    fetchAlunos();
  }, []);

  // Buscar alunos na API
  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/alunos`);
      const result = await response.json();
      
      if (result.success) {
        setAlunos(result.data);
        setFilteredAlunos(result.data);
        console.log('Alunos carregados:', result.data);
      } else {
        handleOpenSnackbar(result.message || 'Erro ao buscar alunos', 'error');
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      handleOpenSnackbar('Não foi possível conectar ao servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Funções para manipulação do snackbar
  const handleOpenSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Funções para filtrar alunos
  const handleSearch = () => {
    let result = [...alunos];
    
    if (searchTerm) {
      result = result.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterTurma) {
      result = result.filter(aluno => aluno.turma === filterTurma);
    }
    
    setFilteredAlunos(result);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTurma('');
    setFilteredAlunos(alunos);
  };

  // Obter lista de turmas disponíveis
  const getTurmas = () => {
    const turmas = [...new Set(alunos.map(aluno => aluno.turma))];
    return turmas.sort();
  };

  // Funções para manipulação do diálogo de cadastro/edição
  const handleOpenDialog = (aluno = null) => {
    if (aluno) {
      setCurrentAluno({ ...aluno });
    } else {
      setCurrentAluno({
        nome: '',
        email: '',
        turma: '',
        telefone: ''
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAluno({
      ...currentAluno,
      [name]: value
    });
    
    // Limpar erro do campo que está sendo editado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentAluno.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!currentAluno.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentAluno.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!currentAluno.turma.trim()) {
      newErrors.turma = 'Turma é obrigatória';
    }
    
    if (currentAluno.telefone && !/^[0-9]{10,11}$/.test(currentAluno.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Formato inválido. Use apenas números (DDD + número)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAluno = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const isEditing = Boolean(currentAluno._id);
      const url = isEditing 
        ? `${API_URL}/alunos/${currentAluno._id}` 
        : `${API_URL}/alunos`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentAluno)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Atualizar a lista de alunos
        fetchAlunos();
        handleCloseDialog();
        handleOpenSnackbar(result.message || (isEditing ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!'));
      } else {
        handleOpenSnackbar(result.error || result.message || 'Erro ao salvar aluno', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      handleOpenSnackbar('Falha na comunicação com o servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAluno = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este aluno?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/alunos/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Atualizar a lista de alunos
        fetchAlunos();
        handleOpenSnackbar(result.message || 'Aluno removido com sucesso!');
      } else {
        handleOpenSnackbar(result.error || result.message || 'Erro ao remover aluno', 'error');
      }
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      handleOpenSnackbar('Falha na comunicação com o servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Renderização
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de Alunos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Aluno
        </Button>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Buscar por nome ou email"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Turma</InputLabel>
              <Select
                value={filterTurma}
                label="Filtrar por Turma"
                onChange={(e) => setFilterTurma(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {getTurmas().map((turma) => (
                  <MenuItem key={turma} value={turma}>
                    {turma}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              Limpar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Alunos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredAlunos.length > 0 ? (
            filteredAlunos.map((aluno) => (
              <Grid item xs={12} sm={6} md={4} key={aluno._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {aluno.nome}
                    </Typography>
                    <Typography color="text.secondary">
                      {aluno.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Turma:</strong> {aluno.turma}
                    </Typography>
                    {aluno.telefone && (
                      <Typography variant="body2">
                        <strong>Telefone:</strong> {aluno.telefone}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(aluno)}
                        aria-label="Editar aluno"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteAluno(aluno._id)}
                        aria-label="Remover aluno"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Nenhum aluno encontrado
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Diálogo de Cadastro/Edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAluno._id ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome completo"
                name="nome"
                value={currentAluno.nome}
                onChange={handleInputChange}
                error={Boolean(errors.nome)}
                helperText={errors.nome}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={currentAluno.email}
                onChange={handleInputChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Turma"
                name="turma"
                value={currentAluno.turma}
                onChange={handleInputChange}
                error={Boolean(errors.turma)}
                helperText={errors.turma}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={currentAluno.telefone}
                onChange={handleInputChange}
                error={Boolean(errors.telefone)}
                helperText={errors.telefone || 'Use apenas números (DDD + número)'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveAluno} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Alunos; 
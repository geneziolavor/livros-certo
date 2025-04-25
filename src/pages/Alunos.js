import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Dados mockados para exemplo
const MOCK_ALUNOS = [
  { id: 1, nome: 'Ana Silva', serie: '6º Ano', turno: 'Manhã', telefone: '(85) 99123-4567' },
  { id: 2, nome: 'João Oliveira', serie: '7º Ano', turno: 'Manhã', telefone: '(85) 98765-4321' },
  { id: 3, nome: 'Maria Santos', serie: '8º Ano', turno: 'Tarde', telefone: '(85) 99876-5432' },
  { id: 4, nome: 'Pedro Lima', serie: '9º Ano', turno: 'Manhã', telefone: '(85) 99765-4322' },
  { id: 5, nome: 'Carla Souza', serie: '1º Ano EM', turno: 'Tarde', telefone: '(85) 99888-7777' }
];

const SERIES = [
  '6º Ano', '7º Ano', '8º Ano', '9º Ano',
  '1º Ano EM', '2º Ano EM', '3º Ano EM'
];

const TURNOS = ['Manhã', 'Tarde', 'Noite'];

const Alunos = () => {
  const [alunos, setAlunos] = useState(MOCK_ALUNOS);
  const [filteredAlunos, setFilteredAlunos] = useState(MOCK_ALUNOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSerie, setFilterSerie] = useState('');
  const [filterTurno, setFilterTurno] = useState('');
  
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAluno, setCurrentAluno] = useState({
    id: null,
    nome: '',
    serie: '',
    turno: '',
    telefone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSerie) {
      result = result.filter(aluno => aluno.serie === filterSerie);
    }
    
    if (filterTurno) {
      result = result.filter(aluno => aluno.turno === filterTurno);
    }
    
    setFilteredAlunos(result);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSerie('');
    setFilterTurno('');
    setFilteredAlunos(alunos);
  };

  // Funções para manipulação do diálogo de cadastro/edição
  const handleOpenDialog = (aluno = null) => {
    if (aluno) {
      setCurrentAluno({ ...aluno });
    } else {
      setCurrentAluno({
        id: alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1,
        nome: '',
        serie: '',
        turno: '',
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
    
    if (!currentAluno.serie) {
      newErrors.serie = 'Série é obrigatória';
    }
    
    if (!currentAluno.turno) {
      newErrors.turno = 'Turno é obrigatório';
    }
    
    if (!currentAluno.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(currentAluno.telefone)) {
      newErrors.telefone = 'Formato inválido. Use (00) 00000-0000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAluno = () => {
    if (!validateForm()) return;
    
    if (currentAluno.id) {
      // Editar aluno existente
      const updatedAlunos = alunos.map(aluno =>
        aluno.id === currentAluno.id ? currentAluno : aluno
      );
      setAlunos(updatedAlunos);
      setFilteredAlunos(
        filteredAlunos.map(aluno =>
          aluno.id === currentAluno.id ? currentAluno : aluno
        )
      );
      handleOpenSnackbar('Aluno atualizado com sucesso!');
    } else {
      // Adicionar novo aluno
      const newAluno = {
        ...currentAluno,
        id: alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1
      };
      setAlunos([...alunos, newAluno]);
      setFilteredAlunos([...filteredAlunos, newAluno]);
      handleOpenSnackbar('Aluno cadastrado com sucesso!');
    }
    
    handleCloseDialog();
  };

  const handleDeleteAluno = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      const updatedAlunos = alunos.filter(aluno => aluno.id !== id);
      setAlunos(updatedAlunos);
      setFilteredAlunos(filteredAlunos.filter(aluno => aluno.id !== id));
      handleOpenSnackbar('Aluno excluído com sucesso!');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Cadastro de Alunos
        </Typography>
        <Typography variant="body1" gutterBottom>
          Gerencie os dados dos alunos por série e turno para configuração dos lembretes de livros.
        </Typography>
      </Box>

      {/* Seção de Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              fullWidth
              label="Buscar por nome"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Série</InputLabel>
              <Select
                value={filterSerie}
                onChange={(e) => setFilterSerie(e.target.value)}
                label="Série"
              >
                <MenuItem value="">Todas</MenuItem>
                {SERIES.map((serie) => (
                  <MenuItem key={serie} value={serie}>
                    {serie}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Turno</InputLabel>
              <Select
                value={filterTurno}
                onChange={(e) => setFilterTurno(e.target.value)}
                label="Turno"
              >
                <MenuItem value="">Todos</MenuItem>
                {TURNOS.map((turno) => (
                  <MenuItem key={turno} value={turno}>
                    {turno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2} md={2}>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ mr: 1 }}
              >
                Filtrar
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={clearFilters}
              >
                Limpar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Seção de Listagem */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2">
          Lista de Alunos ({filteredAlunos.length})
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

      {filteredAlunos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum aluno encontrado.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAlunos.map((aluno) => (
            <Grid item xs={12} sm={6} md={4} key={aluno.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {aluno.nome}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Série:</strong> {aluno.serie}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Turno:</strong> {aluno.turno}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Telefone:</strong> {aluno.telefone}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(aluno)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAluno(aluno.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de cadastro/edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAluno.id ? 'Editar Aluno' : 'Novo Aluno'}
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
                variant="outlined"
                error={!!errors.nome}
                helperText={errors.nome}
                margin="normal"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.serie} margin="normal">
                <InputLabel>Série</InputLabel>
                <Select
                  name="serie"
                  value={currentAluno.serie}
                  onChange={handleInputChange}
                  label="Série"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {SERIES.map((serie) => (
                    <MenuItem key={serie} value={serie}>
                      {serie}
                    </MenuItem>
                  ))}
                </Select>
                {errors.serie && <FormHelperText>{errors.serie}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.turno} margin="normal">
                <InputLabel>Turno</InputLabel>
                <Select
                  name="turno"
                  value={currentAluno.turno}
                  onChange={handleInputChange}
                  label="Turno"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {TURNOS.map((turno) => (
                    <MenuItem key={turno} value={turno}>
                      {turno}
                    </MenuItem>
                  ))}
                </Select>
                {errors.turno && <FormHelperText>{errors.turno}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone do responsável"
                name="telefone"
                value={currentAluno.telefone}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.telefone}
                helperText={errors.telefone || "Formato: (00) 00000-0000"}
                margin="normal"
                placeholder="(00) 00000-0000"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveAluno} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';

// Dados mockados para exemplo
const MOCK_LIVROS = [
  { id: 1, titulo: 'Matemática - 6º Ano', disciplina: 'Matemática', serie: '6º Ano', autor: 'João Silva', editora: 'Educativa' },
  { id: 2, titulo: 'Português e Literatura', disciplina: 'Português', serie: '7º Ano', autor: 'Maria Santos', editora: 'Saber' },
  { id: 3, titulo: 'História do Brasil', disciplina: 'História', serie: '8º Ano', autor: 'Carlos Pereira', editora: 'Nacional' },
  { id: 4, titulo: 'Geografia Mundial', disciplina: 'Geografia', serie: '9º Ano', autor: 'Ana Costa', editora: 'Moderna' },
  { id: 5, titulo: 'Ciências da Natureza', disciplina: 'Ciências', serie: '6º Ano', autor: 'Roberto Lima', editora: 'Educativa' }
];

const DISCIPLINAS = [
  'Matemática', 'Português', 'Ciências', 'História', 'Geografia', 
  'Inglês', 'Educação Física', 'Artes', 'Física', 'Química', 'Biologia'
];

const SERIES = [
  '6º Ano', '7º Ano', '8º Ano', '9º Ano',
  '1º Ano EM', '2º Ano EM', '3º Ano EM'
];

const Livros = () => {
  const [livros, setLivros] = useState(MOCK_LIVROS);
  const [filteredLivros, setFilteredLivros] = useState(MOCK_LIVROS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterSerie, setFilterSerie] = useState('');
  
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLivro, setCurrentLivro] = useState({
    id: null,
    titulo: '',
    disciplina: '',
    serie: '',
    autor: '',
    editora: ''
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

  // Funções para filtrar livros
  const handleSearch = () => {
    let result = [...livros];
    
    if (searchTerm) {
      result = result.filter(livro =>
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.autor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterDisciplina) {
      result = result.filter(livro => livro.disciplina === filterDisciplina);
    }
    
    if (filterSerie) {
      result = result.filter(livro => livro.serie === filterSerie);
    }
    
    setFilteredLivros(result);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDisciplina('');
    setFilterSerie('');
    setFilteredLivros(livros);
  };

  // Funções para manipulação do diálogo de cadastro/edição
  const handleOpenDialog = (livro = null) => {
    if (livro) {
      setCurrentLivro({ ...livro });
    } else {
      setCurrentLivro({
        id: livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1,
        titulo: '',
        disciplina: '',
        serie: '',
        autor: '',
        editora: ''
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
    setCurrentLivro({
      ...currentLivro,
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
    
    if (!currentLivro.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }
    
    if (!currentLivro.disciplina) {
      newErrors.disciplina = 'Disciplina é obrigatória';
    }
    
    if (!currentLivro.serie) {
      newErrors.serie = 'Série é obrigatória';
    }
    
    if (!currentLivro.autor.trim()) {
      newErrors.autor = 'Autor é obrigatório';
    }
    
    if (!currentLivro.editora.trim()) {
      newErrors.editora = 'Editora é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveLivro = () => {
    if (!validateForm()) return;
    
    if (currentLivro.id) {
      // Editar livro existente
      const updatedLivros = livros.map(livro =>
        livro.id === currentLivro.id ? currentLivro : livro
      );
      setLivros(updatedLivros);
      setFilteredLivros(
        filteredLivros.map(livro =>
          livro.id === currentLivro.id ? currentLivro : livro
        )
      );
      handleOpenSnackbar('Livro atualizado com sucesso!');
    } else {
      // Adicionar novo livro
      const newLivro = {
        ...currentLivro,
        id: livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1
      };
      setLivros([...livros, newLivro]);
      setFilteredLivros([...filteredLivros, newLivro]);
      handleOpenSnackbar('Livro cadastrado com sucesso!');
    }
    
    handleCloseDialog();
  };

  const handleDeleteLivro = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      const updatedLivros = livros.filter(livro => livro.id !== id);
      setLivros(updatedLivros);
      setFilteredLivros(filteredLivros.filter(livro => livro.id !== id));
      handleOpenSnackbar('Livro excluído com sucesso!');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Cadastro de Livros
        </Typography>
        <Typography variant="body1" gutterBottom>
          Gerencie os livros didáticos por disciplina e série.
        </Typography>
      </Box>

      {/* Seção de Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              fullWidth
              label="Buscar por título ou autor"
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
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={filterDisciplina}
                onChange={(e) => setFilterDisciplina(e.target.value)}
                label="Disciplina"
              >
                <MenuItem value="">Todas</MenuItem>
                {DISCIPLINAS.map((disciplina) => (
                  <MenuItem key={disciplina} value={disciplina}>
                    {disciplina}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          Lista de Livros ({filteredLivros.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Livro
        </Button>
      </Box>

      {filteredLivros.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum livro encontrado.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredLivros.map((livro) => (
            <Grid item xs={12} sm={6} md={4} key={livro.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MenuBookIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h3" gutterBottom>
                      {livro.titulo}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Disciplina:</strong> {livro.disciplina}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Série:</strong> {livro.serie}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Autor:</strong> {livro.autor}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Editora:</strong> {livro.editora}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(livro)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteLivro(livro.id)}
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
          {currentLivro.id ? 'Editar Livro' : 'Novo Livro'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Livro"
                name="titulo"
                value={currentLivro.titulo}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.titulo}
                helperText={errors.titulo}
                margin="normal"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.disciplina} margin="normal">
                <InputLabel>Disciplina</InputLabel>
                <Select
                  name="disciplina"
                  value={currentLivro.disciplina}
                  onChange={handleInputChange}
                  label="Disciplina"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {DISCIPLINAS.map((disciplina) => (
                    <MenuItem key={disciplina} value={disciplina}>
                      {disciplina}
                    </MenuItem>
                  ))}
                </Select>
                {errors.disciplina && <FormHelperText>{errors.disciplina}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.serie} margin="normal">
                <InputLabel>Série</InputLabel>
                <Select
                  name="serie"
                  value={currentLivro.serie}
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
              <TextField
                fullWidth
                label="Autor"
                name="autor"
                value={currentLivro.autor}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.autor}
                helperText={errors.autor}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Editora"
                name="editora"
                value={currentLivro.editora}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.editora}
                helperText={errors.editora}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveLivro} variant="contained" color="primary">
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

export default Livros; 
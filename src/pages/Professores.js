import React, { useState } from 'react';
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
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Dados mockados para professores
const MOCK_PROFESSORES = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@escola.edu.br',
    telefone: '(11) 98765-4321',
    disciplinas: ['Matemática'],
    formacao: 'Licenciatura em Matemática',
    turmas: ['6º Ano', '7º Ano', '8º Ano'],
    foto: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria.santos@escola.edu.br',
    telefone: '(11) 97654-3210',
    disciplinas: ['Português', 'Literatura'],
    formacao: 'Letras - Português e Literatura',
    turmas: ['9º Ano', '1º Ano EM', '2º Ano EM'],
    foto: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    nome: 'Carlos Pereira',
    email: 'carlos.pereira@escola.edu.br',
    telefone: '(11) 96543-2109',
    disciplinas: ['História'],
    formacao: 'Licenciatura em História',
    turmas: ['8º Ano', '9º Ano', '1º Ano EM'],
    foto: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana.costa@escola.edu.br',
    telefone: '(11) 95432-1098',
    disciplinas: ['Geografia'],
    formacao: 'Licenciatura em Geografia',
    turmas: ['6º Ano', '7º Ano', '3º Ano EM'],
    foto: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    nome: 'Roberto Lima',
    email: 'roberto.lima@escola.edu.br',
    telefone: '(11) 94321-0987',
    disciplinas: ['Ciências', 'Biologia'],
    formacao: 'Licenciatura em Ciências Biológicas',
    turmas: ['7º Ano', '8º Ano', '2º Ano EM', '3º Ano EM'],
    foto: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: 6,
    nome: 'Fernanda Oliveira',
    email: 'fernanda.oliveira@escola.edu.br',
    telefone: '(11) 93210-9876',
    disciplinas: ['Inglês'],
    formacao: 'Letras - Inglês',
    turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'],
    foto: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: 7,
    nome: 'Paulo Mendes',
    email: 'paulo.mendes@escola.edu.br',
    telefone: '(11) 92109-8765',
    disciplinas: ['Física'],
    formacao: 'Licenciatura em Física',
    turmas: ['1º Ano EM', '2º Ano EM', '3º Ano EM'],
    foto: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: 8,
    nome: 'Luciana Alves',
    email: 'luciana.alves@escola.edu.br',
    telefone: '(11) 91098-7654',
    disciplinas: ['Química'],
    formacao: 'Licenciatura em Química',
    turmas: ['1º Ano EM', '2º Ano EM', '3º Ano EM'],
    foto: 'https://randomuser.me/api/portraits/women/8.jpg'
  }
];

const DISCIPLINAS = [
  'Matemática', 'Português', 'Ciências', 'História', 'Geografia', 
  'Inglês', 'Educação Física', 'Artes', 'Física', 'Química', 'Biologia',
  'Literatura', 'Espanhol', 'Filosofia', 'Sociologia'
];

const TURMAS = [
  '6º Ano', '7º Ano', '8º Ano', '9º Ano',
  '1º Ano EM', '2º Ano EM', '3º Ano EM'
];

const FORMACOES = [
  'Licenciatura em Matemática',
  'Letras - Português e Literatura',
  'Licenciatura em História',
  'Licenciatura em Geografia',
  'Licenciatura em Ciências Biológicas',
  'Letras - Inglês',
  'Licenciatura em Física',
  'Licenciatura em Química',
  'Licenciatura em Educação Física',
  'Licenciatura em Artes',
  'Licenciatura em Filosofia',
  'Licenciatura em Sociologia',
  'Bacharelado e Licenciatura em Letras - Português e Espanhol',
  'Mestrado em Educação',
  'Doutorado em Educação'
];

const Professores = () => {
  const [professores, setProfessores] = useState(MOCK_PROFESSORES);
  const [filteredProfessores, setFilteredProfessores] = useState(MOCK_PROFESSORES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState({
    id: null,
    nome: '',
    email: '',
    telefone: '',
    disciplinas: [],
    formacao: '',
    turmas: [],
    foto: ''
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

  // Funções para filtrar professores
  const handleSearch = () => {
    let result = [...professores];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        professor => 
          professor.nome.toLowerCase().includes(term) || 
          professor.email.toLowerCase().includes(term)
      );
    }
    
    if (filterDisciplina) {
      result = result.filter(
        professor => professor.disciplinas.includes(filterDisciplina)
      );
    }
    
    setFilteredProfessores(result);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDisciplina('');
    setFilteredProfessores(professores);
  };

  // Funções para manipulação do diálogo de cadastro/edição
  const handleOpenDialog = (professor = null) => {
    if (professor) {
      setCurrentProfessor({ ...professor });
    } else {
      setCurrentProfessor({
        id: professores.length > 0 ? Math.max(...professores.map(p => p.id)) + 1 : 1,
        nome: '',
        email: '',
        telefone: '',
        disciplinas: [],
        formacao: '',
        turmas: [],
        foto: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`
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
    setCurrentProfessor({
      ...currentProfessor,
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

  const handleMultipleSelectChange = (e) => {
    const { name, value } = e.target;
    setCurrentProfessor({
      ...currentProfessor,
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
    
    if (!currentProfessor.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!currentProfessor.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentProfessor.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!currentProfessor.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    
    if (!currentProfessor.disciplinas.length) {
      newErrors.disciplinas = 'Selecione pelo menos uma disciplina';
    }
    
    if (!currentProfessor.formacao) {
      newErrors.formacao = 'Formação é obrigatória';
    }
    
    if (!currentProfessor.turmas.length) {
      newErrors.turmas = 'Selecione pelo menos uma turma';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfessor = () => {
    if (!validateForm()) return;
    
    if (currentProfessor.id && professores.some(p => p.id === currentProfessor.id)) {
      // Editar professor existente
      const updatedProfessores = professores.map(professor =>
        professor.id === currentProfessor.id ? currentProfessor : professor
      );
      setProfessores(updatedProfessores);
      setFilteredProfessores(
        filteredProfessores.map(professor =>
          professor.id === currentProfessor.id ? currentProfessor : professor
        )
      );
      handleOpenSnackbar('Professor atualizado com sucesso!');
    } else {
      // Adicionar novo professor
      const newProfessor = {
        ...currentProfessor,
        id: professores.length > 0 ? Math.max(...professores.map(p => p.id)) + 1 : 1
      };
      setProfessores([...professores, newProfessor]);
      setFilteredProfessores([...filteredProfessores, newProfessor]);
      handleOpenSnackbar('Professor cadastrado com sucesso!');
    }
    
    handleCloseDialog();
  };

  const handleDeleteProfessor = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      const updatedProfessores = professores.filter(professor => professor.id !== id);
      setProfessores(updatedProfessores);
      setFilteredProfessores(filteredProfessores.filter(professor => professor.id !== id));
      handleOpenSnackbar('Professor excluído com sucesso!');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Professores
        </Typography>
        <Typography variant="body1" gutterBottom>
          Gerencie o corpo docente da escola, atribuindo disciplinas e turmas.
        </Typography>
      </Box>

      {/* Seção de Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} md={5}>
            <TextField
              fullWidth
              label="Pesquisar por nome ou e-mail"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5}>
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
          <Grid item xs={12} sm={2} md={2}>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FilterListIcon />}
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
          Corpo Docente ({filteredProfessores.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Professor
        </Button>
      </Box>

      {filteredProfessores.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum professor encontrado.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProfessores.map((professor) => (
            <Grid item xs={12} sm={6} md={4} key={professor.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={professor.foto}
                      alt={professor.nome}
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="h3">
                        {professor.nome}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {professor.formacao}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box mb={1}>
                    <Typography variant="subtitle2" component="div" gutterBottom>
                      Disciplinas:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {professor.disciplinas.map((disciplina) => (
                        <Chip
                          key={disciplina}
                          label={disciplina}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box mb={1}>
                    <Typography variant="subtitle2" component="div" gutterBottom>
                      Turmas:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {professor.turmas.map((turma) => (
                        <Chip
                          key={turma}
                          label={turma}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                      {professor.email}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                      {professor.telefone}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(professor)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteProfessor(professor.id)}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProfessor.id && professores.some(p => p.id === currentProfessor.id)
            ? 'Editar Professor'
            : 'Novo Professor'
          }
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={currentProfessor.nome}
                onChange={handleInputChange}
                margin="normal"
                error={!!errors.nome}
                helperText={errors.nome}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                value={currentProfessor.email}
                onChange={handleInputChange}
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={currentProfessor.telefone}
                onChange={handleInputChange}
                margin="normal"
                error={!!errors.telefone}
                helperText={errors.telefone}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!errors.formacao} required>
                <InputLabel>Formação</InputLabel>
                <Select
                  name="formacao"
                  value={currentProfessor.formacao}
                  onChange={handleInputChange}
                  label="Formação"
                >
                  {FORMACOES.map((formacao) => (
                    <MenuItem key={formacao} value={formacao}>
                      {formacao}
                    </MenuItem>
                  ))}
                </Select>
                {errors.formacao && <FormHelperText>{errors.formacao}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!errors.disciplinas} required>
                <InputLabel>Disciplinas</InputLabel>
                <Select
                  multiple
                  name="disciplinas"
                  value={currentProfessor.disciplinas}
                  onChange={handleMultipleSelectChange}
                  label="Disciplinas"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {DISCIPLINAS.map((disciplina) => (
                    <MenuItem key={disciplina} value={disciplina}>
                      {disciplina}
                    </MenuItem>
                  ))}
                </Select>
                {errors.disciplinas && <FormHelperText>{errors.disciplinas}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!errors.turmas} required>
                <InputLabel>Turmas</InputLabel>
                <Select
                  multiple
                  name="turmas"
                  value={currentProfessor.turmas}
                  onChange={handleMultipleSelectChange}
                  label="Turmas"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {TURMAS.map((turma) => (
                    <MenuItem key={turma} value={turma}>
                      {turma}
                    </MenuItem>
                  ))}
                </Select>
                {errors.turmas && <FormHelperText>{errors.turmas}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL da Foto"
                name="foto"
                value={currentProfessor.foto}
                onChange={handleInputChange}
                margin="normal"
                helperText="URL da foto do professor (opcional)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveProfessor} variant="contained" color="primary">
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

export default Professores;
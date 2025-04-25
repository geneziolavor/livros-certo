import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
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
  FilterList as FilterListIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// Dados mockados para exemplo
const MOCK_HORARIOS = [
  { id: 1, serie: '6º Ano', diaSemana: 'Segunda-feira', horario: '07:30 - 08:20', disciplina: 'Matemática', professor: 'João Silva' },
  { id: 2, serie: '6º Ano', diaSemana: 'Segunda-feira', horario: '08:20 - 09:10', disciplina: 'Português', professor: 'Maria Santos' },
  { id: 3, serie: '7º Ano', diaSemana: 'Terça-feira', horario: '07:30 - 08:20', disciplina: 'História', professor: 'Carlos Pereira' },
  { id: 4, serie: '7º Ano', diaSemana: 'Terça-feira', horario: '08:20 - 09:10', disciplina: 'Geografia', professor: 'Ana Costa' },
  { id: 5, serie: '8º Ano', diaSemana: 'Quarta-feira', horario: '07:30 - 08:20', disciplina: 'Ciências', professor: 'Roberto Lima' },
  { id: 6, serie: '8º Ano', diaSemana: 'Quarta-feira', horario: '08:20 - 09:10', disciplina: 'Inglês', professor: 'Fernanda Oliveira' },
  { id: 7, serie: '9º Ano', diaSemana: 'Quinta-feira', horario: '07:30 - 08:20', disciplina: 'Física', professor: 'Paulo Mendes' },
  { id: 8, serie: '9º Ano', diaSemana: 'Quinta-feira', horario: '08:20 - 09:10', disciplina: 'Química', professor: 'Luciana Alves' }
];

const SERIES = [
  '6º Ano', '7º Ano', '8º Ano', '9º Ano',
  '1º Ano EM', '2º Ano EM', '3º Ano EM'
];

const DIAS_SEMANA = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira'
];

const HORARIOS_AULA = [
  '07:30 - 08:20', '08:20 - 09:10', '09:10 - 10:00', 
  '10:20 - 11:10', '11:10 - 12:00',
  '13:30 - 14:20', '14:20 - 15:10', '15:10 - 16:00', 
  '16:20 - 17:10', '17:10 - 18:00'
];

const DISCIPLINAS = [
  'Matemática', 'Português', 'Ciências', 'História', 'Geografia', 
  'Inglês', 'Educação Física', 'Artes', 'Física', 'Química', 'Biologia'
];

const PROFESSORES = [
  'João Silva', 'Maria Santos', 'Carlos Pereira', 'Ana Costa', 
  'Roberto Lima', 'Fernanda Oliveira', 'Paulo Mendes', 'Luciana Alves'
];

const Horarios = () => {
  const [horarios, setHorarios] = useState(MOCK_HORARIOS);
  const [filteredHorarios, setFilteredHorarios] = useState(MOCK_HORARIOS);
  const [filterSerie, setFilterSerie] = useState('');
  const [filterDiaSemana, setFilterDiaSemana] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentHorario, setCurrentHorario] = useState({
    id: null,
    serie: '',
    diaSemana: '',
    horario: '',
    disciplina: '',
    professor: ''
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

  // Funções para filtrar horários
  const handleSearch = () => {
    let result = [...horarios];
    
    if (filterSerie) {
      result = result.filter(horario => horario.serie === filterSerie);
    }
    
    if (filterDiaSemana) {
      result = result.filter(horario => horario.diaSemana === filterDiaSemana);
    }
    
    setFilteredHorarios(result);
  };

  const clearFilters = () => {
    setFilterSerie('');
    setFilterDiaSemana('');
    setFilteredHorarios(horarios);
  };

  // Funções para manipulação do diálogo de cadastro/edição
  const handleOpenDialog = (horario = null) => {
    if (horario) {
      setCurrentHorario({ ...horario });
    } else {
      setCurrentHorario({
        id: horarios.length > 0 ? Math.max(...horarios.map(h => h.id)) + 1 : 1,
        serie: '',
        diaSemana: '',
        horario: '',
        disciplina: '',
        professor: ''
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
    setCurrentHorario({
      ...currentHorario,
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
    
    if (!currentHorario.serie) {
      newErrors.serie = 'Série é obrigatória';
    }
    
    if (!currentHorario.diaSemana) {
      newErrors.diaSemana = 'Dia da semana é obrigatório';
    }
    
    if (!currentHorario.horario) {
      newErrors.horario = 'Horário é obrigatório';
    }
    
    if (!currentHorario.disciplina) {
      newErrors.disciplina = 'Disciplina é obrigatória';
    }
    
    if (!currentHorario.professor) {
      newErrors.professor = 'Professor é obrigatório';
    }
    
    // Verificar se já existe um horário igual
    const horarioExistente = horarios.find(h => 
      h.id !== currentHorario.id && 
      h.serie === currentHorario.serie && 
      h.diaSemana === currentHorario.diaSemana && 
      h.horario === currentHorario.horario
    );
    
    if (horarioExistente) {
      newErrors.horario = 'Este horário já está ocupado para esta série e dia da semana';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveHorario = () => {
    if (!validateForm()) return;
    
    if (currentHorario.id) {
      // Editar horário existente
      const updatedHorarios = horarios.map(horario =>
        horario.id === currentHorario.id ? currentHorario : horario
      );
      setHorarios(updatedHorarios);
      setFilteredHorarios(
        filteredHorarios.map(horario =>
          horario.id === currentHorario.id ? currentHorario : horario
        )
      );
      handleOpenSnackbar('Horário atualizado com sucesso!');
    } else {
      // Adicionar novo horário
      const newHorario = {
        ...currentHorario,
        id: horarios.length > 0 ? Math.max(...horarios.map(h => h.id)) + 1 : 1
      };
      setHorarios([...horarios, newHorario]);
      setFilteredHorarios([...filteredHorarios, newHorario]);
      handleOpenSnackbar('Horário cadastrado com sucesso!');
    }
    
    handleCloseDialog();
  };

  const handleDeleteHorario = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este horário?')) {
      const updatedHorarios = horarios.filter(horario => horario.id !== id);
      setHorarios(updatedHorarios);
      setFilteredHorarios(filteredHorarios.filter(horario => horario.id !== id));
      handleOpenSnackbar('Horário excluído com sucesso!');
    }
  };

  // Função para agrupar horários por dia da semana
  const getHorariosByDiaSemana = (diaSemana) => {
    return filteredHorarios.filter(horario => horario.diaSemana === diaSemana);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Quadro de Horários
        </Typography>
        <Typography variant="body1" gutterBottom>
          Gerencie os horários de aulas por série e dia da semana.
        </Typography>
      </Box>

      {/* Seção de Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} md={5}>
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
          <Grid item xs={12} sm={5} md={5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Dia da Semana</InputLabel>
              <Select
                value={filterDiaSemana}
                onChange={(e) => setFilterDiaSemana(e.target.value)}
                label="Dia da Semana"
              >
                <MenuItem value="">Todos</MenuItem>
                {DIAS_SEMANA.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
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
          Horários de Aulas ({filteredHorarios.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Horário
        </Button>
      </Box>

      {filteredHorarios.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum horário encontrado.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Visão de tabela se não houver filtro de dia */}
          {!filterDiaSemana && (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Série</TableCell>
                    <TableCell>Dia da Semana</TableCell>
                    <TableCell>Horário</TableCell>
                    <TableCell>Disciplina</TableCell>
                    <TableCell>Professor</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHorarios.map((horario) => (
                    <TableRow key={horario.id}>
                      <TableCell>{horario.serie}</TableCell>
                      <TableCell>{horario.diaSemana}</TableCell>
                      <TableCell>{horario.horario}</TableCell>
                      <TableCell>{horario.disciplina}</TableCell>
                      <TableCell>{horario.professor}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(horario)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteHorario(horario.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Visão por dia da semana quando filtrado por dia */}
          {filterDiaSemana && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h3">
                        {filterDiaSemana}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Série</TableCell>
                            <TableCell>Horário</TableCell>
                            <TableCell>Disciplina</TableCell>
                            <TableCell>Professor</TableCell>
                            <TableCell align="right">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getHorariosByDiaSemana(filterDiaSemana).map((horario) => (
                            <TableRow key={horario.id}>
                              <TableCell>{horario.serie}</TableCell>
                              <TableCell>{horario.horario}</TableCell>
                              <TableCell>{horario.disciplina}</TableCell>
                              <TableCell>{horario.professor}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleOpenDialog(horario)}
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteHorario(horario.id)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {/* Diálogo de cadastro/edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentHorario.id ? 'Editar Horário' : 'Novo Horário'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.serie} margin="normal">
                <InputLabel>Série</InputLabel>
                <Select
                  name="serie"
                  value={currentHorario.serie}
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
              <FormControl fullWidth error={!!errors.diaSemana} margin="normal">
                <InputLabel>Dia da Semana</InputLabel>
                <Select
                  name="diaSemana"
                  value={currentHorario.diaSemana}
                  onChange={handleInputChange}
                  label="Dia da Semana"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {DIAS_SEMANA.map((dia) => (
                    <MenuItem key={dia} value={dia}>
                      {dia}
                    </MenuItem>
                  ))}
                </Select>
                {errors.diaSemana && <FormHelperText>{errors.diaSemana}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.horario} margin="normal">
                <InputLabel>Horário</InputLabel>
                <Select
                  name="horario"
                  value={currentHorario.horario}
                  onChange={handleInputChange}
                  label="Horário"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {HORARIOS_AULA.map((horario) => (
                    <MenuItem key={horario} value={horario}>
                      {horario}
                    </MenuItem>
                  ))}
                </Select>
                {errors.horario && <FormHelperText>{errors.horario}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.disciplina} margin="normal">
                <InputLabel>Disciplina</InputLabel>
                <Select
                  name="disciplina"
                  value={currentHorario.disciplina}
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
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.professor} margin="normal">
                <InputLabel>Professor</InputLabel>
                <Select
                  name="professor"
                  value={currentHorario.professor}
                  onChange={handleInputChange}
                  label="Professor"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {PROFESSORES.map((professor) => (
                    <MenuItem key={professor} value={professor}>
                      {professor}
                    </MenuItem>
                  ))}
                </Select>
                {errors.professor && <FormHelperText>{errors.professor}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveHorario} variant="contained" color="primary">
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

export default Horarios; 
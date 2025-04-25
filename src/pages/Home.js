import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  CardActions, 
  Grid,
  Paper
} from '@mui/material';
import { 
  People as PeopleIcon, 
  School as SchoolIcon, 
  Book as BookIcon, 
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const features = [
  {
    title: 'Cadastro de Alunos',
    description: 'Registre os alunos por série, turno e horário.',
    icon: <PeopleIcon fontSize="large" color="primary" />,
    link: '/alunos'
  },
  {
    title: 'Cadastro de Professores',
    description: 'Gerencie os professores e suas disciplinas.',
    icon: <SchoolIcon fontSize="large" color="primary" />,
    link: '/professores'
  },
  {
    title: 'Cadastro de Livros',
    description: 'Organize os livros por disciplina e série.',
    icon: <BookIcon fontSize="large" color="primary" />,
    link: '/livros'
  },
  {
    title: 'Horários de Aula',
    description: 'Configure os horários por dia da semana e turma.',
    icon: <ScheduleIcon fontSize="large" color="primary" />,
    link: '/horarios'
  },
  {
    title: 'Lembretes',
    description: 'Configure alertas para não esquecer os livros.',
    icon: <NotificationsIcon fontSize="large" color="primary" />,
    link: '/lembretes'
  }
];

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          py: 6,
          px: 4,
          mb: 6,
          backgroundImage: 'linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.7))',
          color: 'white',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Livros Certo
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Nunca mais esqueça os livros didáticos para a aula!
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              Um aplicativo para ajudar alunos a não esquecerem quais livros didáticos 
              levar para a escola, de acordo com o horário e disciplinas do dia.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/lembretes"
              sx={{ fontWeight: 'bold' }}
            >
              Configurar Lembretes
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom color="primary">
          Funcionalidades
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          O aplicativo Livros Certo oferece várias ferramentas para ajudar na organização dos 
          livros didáticos e garantir que os alunos não esqueçam do material necessário para as aulas.
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    component={RouterLink}
                    to={feature.link}
                    variant="outlined" 
                    color="primary"
                  >
                    Acessar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* School Information */}
      <Box sx={{ bgcolor: 'background.default', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom color="primary">
            Escola Professor Pedro Teixeira Barroso
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            O aplicativo Livros Certo foi desenvolvido especialmente para os alunos da 
            Escola Professor Pedro Teixeira Barroso, ajudando na organização dos 
            materiais didáticos e melhorando o aprendizado.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/alunos"
              sx={{ mx: 2, mb: 2 }}
            >
              Cadastrar Alunos
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/horarios"
              sx={{ mx: 2, mb: 2 }}
            >
              Configurar Horários
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
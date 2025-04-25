import React from 'react';
import { Box, Typography, Container, Link, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Escola Professor Pedro Teixeira Barroso
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Aplicativo para controle de livros didáticos dos alunos conforme horário das aulas
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Desenvolvido por: 
            <Link 
              href="#" 
              color="primary"
              sx={{ ml: 1, fontWeight: 'bold', textDecoration: 'none' }}
            >
              Genezio de Lavor Oliveira
            </Link>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Clube de Robótica Criativa &copy; {currentYear}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
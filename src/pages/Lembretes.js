import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Lembretes = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Lembretes
        </Typography>
        <Typography variant="body1" gutterBottom>
          Configure lembretes para os alunos não esquecerem os livros didáticos.
        </Typography>
      </Box>
      
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="body1" align="center">
          Esta funcionalidade será implementada em breve.
        </Typography>
      </Box>
    </Container>
  );
};

export default Lembretes; 
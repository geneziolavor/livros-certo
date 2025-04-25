const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB com opções adicionais para debug
mongoose.connect(process.env.MONGODB_URI, {
  // As opções abaixo ajudam a debugar a conexão com o MongoDB
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
  });

// Middleware para logging detalhado de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
  }
  
  // Captura a resposta para log
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[${timestamp}] Resposta enviada:`, 
      body.substring ? body.substring(0, 200) + (body.length > 200 ? '...' : '') : body);
    return originalSend.apply(this, arguments);
  };
  
  next();
});

// Rotas
app.use('/api', require('./routes/professorRoutes'));
app.use('/api', require('./routes/alunoRoutes'));
app.use('/api', require('./routes/livroRoutes'));
app.use('/api', require('./routes/horarioRoutes'));
app.use('/api', require('./routes/lembreteRoutes'));

// Middleware para tratamento de erros (deve vir depois das rotas)
app.use((err, req, res, next) => {
  console.error('❌ Erro na aplicação:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Ativar depuração do Mongoose (para ver todas as operações no banco de dados)
mongoose.set('debug', true);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} em ${process.env.NODE_ENV || 'development'}`)); 
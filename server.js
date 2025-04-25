const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const lembretesRoutes = require('./src/routes/lembretes');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/lembretes', lembretesRoutes);

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 
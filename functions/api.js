const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
require('dotenv').config();

// Inicializar o app
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/api', router);

// Definir esquema de Aluno
const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  turma: { type: String, required: true },
  telefone: { type: String }
});

// Definir modelo
const Aluno = mongoose.models.Aluno || mongoose.model('Aluno', AlunoSchema);

// Rota de teste simples
router.get('/', (req, res) => {
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota para listar alunos
router.get('/alunos', async (req, res) => {
  try {
    // Primeiro tentar conectar ao MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB conectado na rota GET /alunos');
    }
    
    const alunos = await Aluno.find().sort({ nome: 1 });
    res.json({
      success: true,
      count: alunos.length,
      data: alunos
    });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alunos',
      error: error.message
    });
  }
});

// Rota para adicionar aluno
router.post('/alunos', async (req, res) => {
  try {
    console.log('Recebido POST /alunos com dados:', JSON.stringify(req.body));
    
    // Primeiro tentar conectar ao MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB conectado na rota POST /alunos');
    }
    
    const { nome, email, turma, telefone } = req.body;
    
    // Validação básica
    if (!nome || !email || !turma) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e turma são obrigatórios'
      });
    }
    
    // Criar novo aluno
    const aluno = new Aluno({ nome, email, turma, telefone });
    const novoAluno = await aluno.save();
    
    res.status(201).json({
      success: true,
      message: 'Aluno cadastrado com sucesso!',
      data: novoAluno
    });
    
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    
    let mensagem = 'Erro ao cadastrar aluno';
    let statusCode = 500;
    
    if (error.code === 11000) {
      mensagem = 'Email já cadastrado';
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      success: false,
      message: mensagem,
      error: error.message
    });
  }
});

// Exportar para o Netlify
module.exports.handler = serverless(app); 
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
require('dotenv').config();

// Esquemas
const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  turma: { type: String, required: true },
  telefone: { type: String }
});

const Aluno = mongoose.model('Aluno', AlunoSchema);

// Inicializar app
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/api', router);

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ MongoDB Atlas conectado com sucesso!');
  console.log('🔗 Conectado a: ' + process.env.MONGODB_URI.split('@')[1].split('/?')[0]);
})
.catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err.message);
  console.error('❌ Código do erro:', err.code);
  console.error('🔄 URI de conexão utilizada:', 
    process.env.MONGODB_URI ? 
    process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@') : 
    'Não definida'
  );
});

// Rota de teste
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas para Alunos
router.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find().sort({ nome: 1 });
    res.json({
      success: true,
      count: alunos.length,
      data: alunos
    });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alunos',
      error: error.message
    });
  }
});

router.post('/alunos', async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    const novoAluno = await aluno.save();
    res.status(201).json({
      success: true,
      message: 'Aluno cadastrado com sucesso!',
      data: novoAluno
    });
  } catch (error) {
    let mensagem = 'Não foi possível cadastrar o aluno';
    let statusCode = 400;
    
    if (error.code === 11000) {
      mensagem = 'Email já cadastrado';
    }
    
    res.status(statusCode).json({
      success: false,
      message: mensagem,
      error: error.message
    });
  }
});

router.put('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!aluno) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno atualizado com sucesso!',
      data: aluno
    });
  } catch (error) {
    let mensagem = 'Não foi possível atualizar o aluno';
    let statusCode = 400;
    
    if (error.code === 11000) {
      mensagem = 'Email já cadastrado';
    }
    
    res.status(statusCode).json({
      success: false,
      message: mensagem,
      error: error.message
    });
  }
});

router.delete('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno removido com sucesso',
      data: aluno
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover aluno',
      error: error.message
    });
  }
});

// Exportar a função handler para Netlify
module.exports.handler = serverless(app); 
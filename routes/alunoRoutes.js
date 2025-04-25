const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');

// Listar todos os alunos
router.get('/alunos', async (req, res) => {
  try {
    console.log('📊 Buscando todos os alunos...');
    const alunos = await Aluno.find().sort({ nome: 1 });
    console.log(`✅ ${alunos.length} alunos encontrados`);
    res.json({
      success: true,
      count: alunos.length,
      data: alunos
    });
  } catch (error) {
    console.error('❌ Erro ao buscar alunos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar alunos',
      error: error.message 
    });
  }
});

// Criar um novo aluno
router.post('/alunos', async (req, res) => {
  try {
    console.log('📝 Criando novo aluno com dados:', req.body);
    
    // Validar se os campos obrigatórios foram fornecidos
    if (!req.body.nome || !req.body.email || !req.body.turma) {
      console.log('❌ Dados incompletos fornecidos');
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça nome, email e turma'
      });
    }
    
    const aluno = new Aluno(req.body);
    const novoAluno = await aluno.save();
    
    console.log(`✅ Aluno criado com sucesso! ID: ${novoAluno._id}`);
    res.status(201).json({
      success: true,
      message: 'Aluno cadastrado com sucesso!',
      data: novoAluno
    });
  } catch (error) {
    console.error('❌ Erro ao criar aluno:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
        error: 'Este email já está sendo usado por outro aluno'
      });
    } 
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        error: messages.join(', ')
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Não foi possível cadastrar o aluno',
      error: error.message
    });
  }
});

// Atualizar um aluno
router.put('/alunos/:id', async (req, res) => {
  try {
    console.log(`📝 Atualizando aluno ID: ${req.params.id}`);
    console.log('Dados recebidos:', req.body);
    
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!aluno) {
      console.log(`❌ Aluno ID ${req.params.id} não encontrado`);
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    console.log(`✅ Aluno ID ${req.params.id} atualizado com sucesso`);
    res.json({
      success: true,
      message: 'Aluno atualizado com sucesso!',
      data: aluno
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar aluno:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
        error: 'Este email já está sendo usado por outro aluno'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        error: messages.join(', ')
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Não foi possível atualizar o aluno',
      error: error.message
    });
  }
});

// Deletar um aluno
router.delete('/alunos/:id', async (req, res) => {
  try {
    console.log(`🗑️ Removendo aluno ID: ${req.params.id}`);
    
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    
    if (!aluno) {
      console.log(`❌ Aluno ID ${req.params.id} não encontrado`);
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    console.log(`✅ Aluno ID ${req.params.id} removido com sucesso`);
    res.json({
      success: true,
      message: 'Aluno removido com sucesso',
      data: aluno
    });
  } catch (error) {
    console.error('❌ Erro ao remover aluno:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover aluno',
      error: error.message
    });
  }
});

module.exports = router; 
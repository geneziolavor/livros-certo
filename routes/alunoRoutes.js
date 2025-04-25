const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');

// Listar todos os alunos
router.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find().sort({ nome: 1 });
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar um novo aluno
router.post('/alunos', async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    const novoAluno = await aluno.save();
    res.status(201).json(novoAluno);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Atualizar um aluno
router.put('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.json(aluno);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Deletar um aluno
router.delete('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.json({ message: 'Aluno removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
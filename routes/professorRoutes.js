const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');

// Listar todos os professores
router.get('/professores', async (req, res) => {
  try {
    const professores = await Professor.find().sort({ nome: 1 });
    res.json(professores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar um novo professor
router.post('/professores', async (req, res) => {
  try {
    const professor = new Professor(req.body);
    const novoProfessor = await professor.save();
    res.status(201).json(novoProfessor);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Atualizar um professor
router.put('/professores/:id', async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json(professor);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Deletar um professor
router.delete('/professores/:id', async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json({ message: 'Professor removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
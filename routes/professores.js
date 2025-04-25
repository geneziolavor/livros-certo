const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');

// Listar todos os professores
router.get('/', async (req, res) => {
  try {
    const professores = await Professor.find();
    res.json(professores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar um professor específico
router.get('/:id', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (professor) {
      res.json(professor);
    } else {
      res.status(404).json({ message: 'Professor não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar um novo professor
router.post('/', async (req, res) => {
  const professor = new Professor({
    nome: req.body.nome,
    email: req.body.email,
    disciplina: req.body.disciplina,
    telefone: req.body.telefone
  });

  try {
    const novoProfessor = await professor.save();
    res.status(201).json(novoProfessor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar um professor
router.patch('/:id', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (professor) {
      if (req.body.nome) professor.nome = req.body.nome;
      if (req.body.email) professor.email = req.body.email;
      if (req.body.disciplina) professor.disciplina = req.body.disciplina;
      if (req.body.telefone) professor.telefone = req.body.telefone;

      const professorAtualizado = await professor.save();
      res.json(professorAtualizado);
    } else {
      res.status(404).json({ message: 'Professor não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar um professor
router.delete('/:id', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (professor) {
      await professor.remove();
      res.json({ message: 'Professor removido' });
    } else {
      res.status(404).json({ message: 'Professor não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
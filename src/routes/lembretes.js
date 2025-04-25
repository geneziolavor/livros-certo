const express = require('express');
const router = express.Router();
const Lembrete = require('../models/Lembrete');

// Obter todos os lembretes
router.get('/', async (req, res) => {
  try {
    const lembretes = await Lembrete.find().sort({ data: 1 });
    res.json(lembretes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar um novo lembrete
router.post('/', async (req, res) => {
  const lembrete = new Lembrete({
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    data: req.body.data,
    prioridade: req.body.prioridade,
    status: req.body.status
  });

  try {
    const novoLembrete = await lembrete.save();
    res.status(201).json(novoLembrete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar um lembrete
router.patch('/:id', async (req, res) => {
  try {
    const lembrete = await Lembrete.findById(req.params.id);
    if (lembrete) {
      Object.assign(lembrete, req.body);
      const lembreteAtualizado = await lembrete.save();
      res.json(lembreteAtualizado);
    } else {
      res.status(404).json({ message: 'Lembrete não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar um lembrete
router.delete('/:id', async (req, res) => {
  try {
    const lembrete = await Lembrete.findById(req.params.id);
    if (lembrete) {
      await lembrete.remove();
      res.json({ message: 'Lembrete deletado' });
    } else {
      res.status(404).json({ message: 'Lembrete não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
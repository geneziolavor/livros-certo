const express = require('express');
const router = express.Router();
const Lembrete = require('../models/Lembrete');

// Listar todos os lembretes
router.get('/lembretes', async (req, res) => {
  try {
    const lembretes = await Lembrete.find().sort({ data: 1 });
    res.json(lembretes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar um novo lembrete
router.post('/lembretes', async (req, res) => {
  try {
    const lembrete = new Lembrete(req.body);
    const novoLembrete = await lembrete.save();
    res.status(201).json(novoLembrete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar um lembrete
router.put('/lembretes/:id', async (req, res) => {
  try {
    const lembrete = await Lembrete.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lembrete) {
      return res.status(404).json({ message: 'Lembrete não encontrado' });
    }
    
    res.json(lembrete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar um lembrete
router.delete('/lembretes/:id', async (req, res) => {
  try {
    const lembrete = await Lembrete.findByIdAndDelete(req.params.id);
    
    if (!lembrete) {
      return res.status(404).json({ message: 'Lembrete não encontrado' });
    }
    
    res.json({ message: 'Lembrete removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
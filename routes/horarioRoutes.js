const express = require('express');
const router = express.Router();
const Horario = require('../models/Horario');

// Listar todos os horários
router.get('/horarios', async (req, res) => {
  try {
    const horarios = await Horario.find()
      .populate('professor', 'nome')
      .sort({ diaSemana: 1, horarioInicio: 1 });
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar um novo horário
router.post('/horarios', async (req, res) => {
  try {
    const horario = new Horario(req.body);
    const novoHorario = await horario.save();
    const horarioPopulado = await Horario.findById(novoHorario._id)
      .populate('professor', 'nome');
    res.status(201).json(horarioPopulado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar um horário
router.put('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('professor', 'nome');
    
    if (!horario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }
    
    res.json(horario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar um horário
router.delete('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findByIdAndDelete(req.params.id);
    
    if (!horario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }
    
    res.json({ message: 'Horário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
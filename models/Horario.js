const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'O professor é obrigatório']
  },
  disciplina: {
    type: String,
    required: [true, 'A disciplina é obrigatória'],
    trim: true
  },
  turma: {
    type: String,
    required: [true, 'A turma é obrigatória'],
    trim: true
  },
  diaSemana: {
    type: String,
    required: [true, 'O dia da semana é obrigatório'],
    enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
  },
  horarioInicio: {
    type: String,
    required: [true, 'O horário de início é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)']
  },
  horarioFim: {
    type: String,
    required: [true, 'O horário de fim é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Horario', horarioSchema); 
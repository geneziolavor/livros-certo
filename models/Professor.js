const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido']
  },
  disciplina: {
    type: String,
    required: [true, 'A disciplina é obrigatória'],
    trim: true
  },
  telefone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Por favor, insira um número de telefone válido']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Professor', professorSchema); 
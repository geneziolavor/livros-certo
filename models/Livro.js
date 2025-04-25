const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'O autor é obrigatório'],
    trim: true
  },
  disciplina: {
    type: String,
    required: [true, 'A disciplina é obrigatória'],
    trim: true
  },
  quantidade: {
    type: Number,
    required: [true, 'A quantidade é obrigatória'],
    min: [0, 'A quantidade não pode ser negativa']
  },
  disponivel: {
    type: Number,
    required: [true, 'A quantidade disponível é obrigatória'],
    min: [0, 'A quantidade disponível não pode ser negativa']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Livro', livroSchema); 
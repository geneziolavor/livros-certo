const mongoose = require('mongoose');

const lembreteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'A descrição é obrigatória'],
    trim: true
  },
  data: {
    type: Date,
    required: [true, 'A data é obrigatória']
  },
  prioridade: {
    type: String,
    required: [true, 'A prioridade é obrigatória'],
    enum: ['Baixa', 'Média', 'Alta']
  },
  status: {
    type: String,
    required: [true, 'O status é obrigatório'],
    enum: ['Pendente', 'Concluído', 'Cancelado'],
    default: 'Pendente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lembrete', lembreteSchema); 
const mongoose = require('mongoose');

const lembreteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  prioridade: {
    type: String,
    enum: ['Baixa', 'Média', 'Alta'],
    default: 'Média'
  },
  status: {
    type: String,
    enum: ['Pendente', 'Concluído'],
    default: 'Pendente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lembrete', lembreteSchema); 
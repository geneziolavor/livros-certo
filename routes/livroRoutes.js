const express = require('express');
const router = express.Router();
const Livro = require('../models/Livro');

// Listar todos os livros
router.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find().sort({ titulo: 1 });
    res.json(livros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar um novo livro
router.post('/livros', async (req, res) => {
  try {
    const livro = new Livro(req.body);
    const novoLivro = await livro.save();
    res.status(201).json(novoLivro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar um livro
router.put('/livros/:id', async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!livro) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    res.json(livro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar um livro
router.delete('/livros/:id', async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);
    
    if (!livro) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    res.json({ message: 'Livro removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
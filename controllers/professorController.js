const Professor = require('../models/Professor');

// Listar todos os professores
exports.listarProfessores = async (req, res) => {
  try {
    const professores = await Professor.find().sort({ nome: 1 });
    res.json(professores);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professores', error: error.message });
  }
};

// Criar um novo professor
exports.criarProfessor = async (req, res) => {
  try {
    const professor = new Professor(req.body);
    await professor.save();
    res.status(201).json(professor);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(400).json({ message: 'Erro ao criar professor', error: error.message });
    }
  }
};

// Atualizar um professor
exports.atualizarProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json(professor);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(400).json({ message: 'Erro ao atualizar professor', error: error.message });
    }
  }
};

// Deletar um professor
exports.deletarProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }
    
    res.json({ message: 'Professor removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar professor', error: error.message });
  }
}; 
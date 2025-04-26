import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados
const db = SQLite.openDatabase('livrosdidaticos.db');

// Inicializa todas as tabelas do banco de dados
const initDB = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      tx => {
        // Tabela de livros
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS livros (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, autor TEXT, editora TEXT, serie TEXT, anoEdicao TEXT, disciplina TEXT, quantidade INTEGER, observacoes TEXT)',
          []
        );

        // Tabela de alunos
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS alunos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, matricula TEXT, turma TEXT, serie TEXT, telefone TEXT, responsavel TEXT, observacoes TEXT)',
          []
        );

        // Tabela de professores
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS professores (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, disciplinas TEXT, email TEXT, telefone TEXT, observacoes TEXT)',
          []
        );

        // Tabela de disciplinas
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS disciplinas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, area TEXT, descricao TEXT)',
          []
        );

        // Tabela de empréstimos
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS emprestimos (id INTEGER PRIMARY KEY AUTOINCREMENT, livroId INTEGER, alunoId INTEGER, dataEmprestimo TEXT, dataDevolucaoPrevista TEXT, dataDevolucaoReal TEXT, status TEXT, observacoes TEXT, FOREIGN KEY (livroId) REFERENCES livros(id), FOREIGN KEY (alunoId) REFERENCES alunos(id))',
          []
        );
      },
      (error) => {
        console.error("Erro na transação de inicialização do banco de dados:", error);
        reject(error);
      },
      () => {
        console.log("Banco de dados inicializado com sucesso!");
        resolve();
      }
    );
  });
};

//-------------------------
// OPERAÇÕES PARA LIVROS
//-------------------------

// Adicionar um novo livro
const addLivro = (livro: any) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO livros (titulo, autor, editora, serie, anoEdicao, disciplina, quantidade, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [livro.titulo, livro.autor, livro.editora, livro.serie, livro.anoEdicao, livro.disciplina, parseInt(livro.quantidade) || 0, livro.observacoes],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Obter todos os livros
const getLivros = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM livros ORDER BY titulo',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Atualizar um livro
const updateLivro = (livro: any) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE livros SET titulo = ?, autor = ?, editora = ?, serie = ?, anoEdicao = ?, disciplina = ?, quantidade = ?, observacoes = ? WHERE id = ?',
        [livro.titulo, livro.autor, livro.editora, livro.serie, livro.anoEdicao, livro.disciplina, parseInt(livro.quantidade) || 0, livro.observacoes, livro.id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Deletar um livro
const deleteLivro = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM livros WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar um livro pelo ID
const getLivroPorId = (id: number) => {
  return new Promise<any | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM livros WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0]);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar livros por disciplina
const getLivrosPorDisciplina = (disciplina: string) => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM livros WHERE disciplina = ? ORDER BY titulo',
        [disciplina],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

//-------------------------
// OPERAÇÕES PARA ALUNOS
//-------------------------

// Adicionar um novo aluno
const addAluno = (aluno: any) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO alunos (nome, matricula, turma, serie, telefone, responsavel, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [aluno.nome, aluno.matricula, aluno.turma, aluno.serie, aluno.telefone, aluno.responsavel, aluno.observacoes],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Obter todos os alunos
const getAlunos = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM alunos ORDER BY nome',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Atualizar um aluno
const updateAluno = (aluno: any) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE alunos SET nome = ?, matricula = ?, turma = ?, serie = ?, telefone = ?, responsavel = ?, observacoes = ? WHERE id = ?',
        [aluno.nome, aluno.matricula, aluno.turma, aluno.serie, aluno.telefone, aluno.responsavel, aluno.observacoes, aluno.id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Deletar um aluno
const deleteAluno = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM alunos WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar um aluno pelo ID
const getAlunoPorId = (id: number) => {
  return new Promise<any | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM alunos WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0]);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

//-------------------------
// OPERAÇÕES PARA PROFESSORES
//-------------------------

// Adicionar um novo professor
const addProfessor = (professor: any) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO professores (nome, disciplinas, email, telefone, observacoes) VALUES (?, ?, ?, ?, ?)',
        [professor.nome, professor.disciplinas, professor.email, professor.telefone, professor.observacoes],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Obter todos os professores
const getProfessores = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM professores ORDER BY nome',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Atualizar um professor
const updateProfessor = (professor: any) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE professores SET nome = ?, disciplinas = ?, email = ?, telefone = ?, observacoes = ? WHERE id = ?',
        [professor.nome, professor.disciplinas, professor.email, professor.telefone, professor.observacoes, professor.id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Deletar um professor
const deleteProfessor = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM professores WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar um professor pelo ID
const getProfessorPorId = (id: number) => {
  return new Promise<any | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM professores WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0]);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

//-------------------------
// OPERAÇÕES PARA DISCIPLINAS
//-------------------------

// Adicionar uma nova disciplina
const addDisciplina = (disciplina: any) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO disciplinas (nome, area, descricao) VALUES (?, ?, ?)',
        [disciplina.nome, disciplina.area, disciplina.descricao],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Obter todas as disciplinas
const getDisciplinas = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM disciplinas ORDER BY nome',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Atualizar uma disciplina
const updateDisciplina = (disciplina: any) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE disciplinas SET nome = ?, area = ?, descricao = ? WHERE id = ?',
        [disciplina.nome, disciplina.area, disciplina.descricao, disciplina.id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Deletar uma disciplina
const deleteDisciplina = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM disciplinas WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar uma disciplina pelo ID
const getDisciplinaPorId = (id: number) => {
  return new Promise<any | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM disciplinas WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0]);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

//-------------------------
// OPERAÇÕES PARA EMPRÉSTIMOS
//-------------------------

// Adicionar um novo empréstimo
const addEmprestimo = (emprestimo: any) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO emprestimos (livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista, status, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
        [emprestimo.livroId, emprestimo.alunoId, emprestimo.dataEmprestimo, emprestimo.dataDevolucaoPrevista, emprestimo.status || 'Emprestado', emprestimo.observacoes],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Obter todos os empréstimos
const getEmprestimos = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT e.*, l.titulo as livroTitulo, a.nome as alunoNome 
         FROM emprestimos e
         JOIN livros l ON e.livroId = l.id
         JOIN alunos a ON e.alunoId = a.id
         ORDER BY e.dataEmprestimo DESC`,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Obter empréstimos em atraso
const getEmprestimosEmAtraso = () => {
  const hoje = new Date().toISOString().split('T')[0];
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT e.*, l.titulo as livroTitulo, a.nome as alunoNome 
         FROM emprestimos e
         JOIN livros l ON e.livroId = l.id
         JOIN alunos a ON e.alunoId = a.id
         WHERE e.dataDevolucaoPrevista < ? AND e.status = 'Emprestado'
         ORDER BY e.dataDevolucaoPrevista`,
        [hoje],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Registrar devolução
const registrarDevolucao = (id: number, dataDevolucao: string) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE emprestimos SET dataDevolucaoReal = ?, status = "Devolvido" WHERE id = ?',
        [dataDevolucao, id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar empréstimos por aluno
const getEmprestimosPorAluno = (alunoId: number) => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT e.*, l.titulo as livroTitulo
         FROM emprestimos e
         JOIN livros l ON e.livroId = l.id
         WHERE e.alunoId = ?
         ORDER BY e.dataEmprestimo DESC`,
        [alunoId],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Buscar empréstimos por livro
const getEmprestimosPorLivro = (livroId: number) => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT e.*, a.nome as alunoNome
         FROM emprestimos e
         JOIN alunos a ON e.alunoId = a.id
         WHERE e.livroId = ?
         ORDER BY e.dataEmprestimo DESC`,
        [livroId],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const Database = {
  initDB,
  // Livros
  addLivro,
  getLivros,
  updateLivro,
  deleteLivro,
  getLivroPorId,
  getLivrosPorDisciplina,
  // Alunos
  addAluno,
  getAlunos,
  updateAluno,
  deleteAluno,
  getAlunoPorId,
  // Professores
  addProfessor,
  getProfessores,
  updateProfessor,
  deleteProfessor,
  getProfessorPorId,
  // Disciplinas
  addDisciplina,
  getDisciplinas,
  updateDisciplina,
  deleteDisciplina,
  getDisciplinaPorId,
  // Empréstimos
  addEmprestimo,
  getEmprestimos,
  getEmprestimosEmAtraso,
  registrarDevolucao,
  getEmprestimosPorAluno,
  getEmprestimosPorLivro
}; 
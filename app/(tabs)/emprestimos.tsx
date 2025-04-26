import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Database } from '../../lib/database';
import { Picker } from '@react-native-picker/picker';

// Tipo para representar um empréstimo
interface Emprestimo {
  id: number;
  livroId: number;
  alunoId: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
  status: 'Emprestado' | 'Devolvido';
  observacoes?: string;
  livroTitulo?: string;
  alunoNome?: string;
}

// Tipo para livro no picker
interface LivroOption {
  id: number;
  titulo: string;
}

// Tipo para aluno no picker
interface AlunoOption {
  id: number;
  nome: string;
}

export default function EmprestimosScreen() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [livros, setLivros] = useState<LivroOption[]>([]);
  const [alunos, setAlunos] = useState<AlunoOption[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [livroId, setLivroId] = useState<number>(0);
  const [alunoId, setAlunoId] = useState<number>(0);
  const [dataEmprestimo, setDataEmprestimo] = useState(new Date().toISOString().split('T')[0]);
  const [dataDevolucaoPrevista, setDataDevolucaoPrevista] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [modalDevolucaoVisible, setModalDevolucaoVisible] = useState(false);
  const [emprestimoAtual, setEmprestimoAtual] = useState<Emprestimo | null>(null);
  const [dataDevolucao, setDataDevolucao] = useState(new Date().toISOString().split('T')[0]);

  // Carregar empréstimos e dados relacionados ao inicializar
  useEffect(() => {
    carregarDados();
  }, []);

  // Função para carregar todos os dados necessários
  const carregarDados = async () => {
    try {
      setCarregando(true);
      await Promise.all([
        carregarEmprestimos(),
        carregarLivros(),
        carregarAlunos()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para carregar empréstimos
  const carregarEmprestimos = async () => {
    try {
      const emprestimosData = await Database.getEmprestimos();
      setEmprestimos(emprestimosData);
      return emprestimosData;
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
      throw error;
    }
  };

  // Função para carregar livros
  const carregarLivros = async () => {
    try {
      const livrosData = await Database.getLivros();
      setLivros(livrosData.map(l => ({ id: l.id, titulo: l.titulo })));
      return livrosData;
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      throw error;
    }
  };

  // Função para carregar alunos
  const carregarAlunos = async () => {
    try {
      const alunosData = await Database.getAlunos();
      setAlunos(alunosData.map(a => ({ id: a.id, nome: a.nome })));
      return alunosData;
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      throw error;
    }
  };

  const limparFormulario = () => {
    setLivroId(0);
    setAlunoId(0);
    setDataEmprestimo(new Date().toISOString().split('T')[0]);
    
    // Definir a data de devolução prevista para 15 dias depois
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + 15);
    setDataDevolucaoPrevista(dataAtual.toISOString().split('T')[0]);
    
    setObservacoes('');
  };

  const abrirModal = () => {
    limparFormulario();
    setModalVisible(true);
  };

  const abrirModalDevolucao = (emprestimo: Emprestimo) => {
    setEmprestimoAtual(emprestimo);
    setDataDevolucao(new Date().toISOString().split('T')[0]);
    setModalDevolucaoVisible(true);
  };

  const salvarEmprestimo = async () => {
    if (!livroId || !alunoId || !dataEmprestimo || !dataDevolucaoPrevista) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    try {
      const novoEmprestimo = {
        livroId,
        alunoId,
        dataEmprestimo,
        dataDevolucaoPrevista,
        status: 'Emprestado',
        observacoes
      };
      
      await Database.addEmprestimo(novoEmprestimo);
      Alert.alert('Sucesso', 'Empréstimo registrado com sucesso!');
      
      // Recarregar empréstimos após salvar
      await carregarEmprestimos();
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar empréstimo:', error);
      Alert.alert('Erro', 'Não foi possível registrar o empréstimo.');
    }
  };

  const registrarDevolucao = async () => {
    if (!emprestimoAtual || !dataDevolucao) {
      Alert.alert('Erro', 'Por favor, selecione uma data de devolução válida!');
      return;
    }

    try {
      await Database.registrarDevolucao(emprestimoAtual.id, dataDevolucao);
      Alert.alert('Sucesso', 'Devolução registrada com sucesso!');
      
      // Recarregar empréstimos após registrar devolução
      await carregarEmprestimos();
      setModalDevolucaoVisible(false);
    } catch (error) {
      console.error('Erro ao registrar devolução:', error);
      Alert.alert('Erro', 'Não foi possível registrar a devolução.');
    }
  };

  const formatarData = (dataString: string) => {
    const partes = dataString.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const renderItem = ({ item }: { item: Emprestimo }) => {
    const estaEmAtraso = item.status === 'Emprestado' && new Date(item.dataDevolucaoPrevista) < new Date() && !item.dataDevolucaoReal;
    
    return (
      <View style={[styles.emprestimoItem, estaEmAtraso && styles.emprestimoAtrasado]}>
        <View style={styles.emprestimoInfo}>
          <Text style={styles.tituloEmprestimo}>{item.livroTitulo}</Text>
          <Text>Aluno: {item.alunoNome}</Text>
          <Text>Empréstimo: {formatarData(item.dataEmprestimo)}</Text>
          <Text>Devolução prevista: {formatarData(item.dataDevolucaoPrevista)}</Text>
          {item.dataDevolucaoReal && (
            <Text>Devolvido em: {formatarData(item.dataDevolucaoReal)}</Text>
          )}
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusBadge, 
              item.status === 'Devolvido' ? styles.statusDevolvido : 
              estaEmAtraso ? styles.statusAtrasado : styles.statusEmprestado
            ]}>
              {item.status === 'Devolvido' ? 'Devolvido' : estaEmAtraso ? 'Em atraso' : 'Emprestado'}
            </Text>
          </View>
        </View>
        
        {item.status === 'Emprestado' && (
          <View style={styles.botoesAcao}>
            <TouchableOpacity 
              style={[styles.botao, styles.botaoDevolver]}
              onPress={() => abrirModalDevolucao(item)}
            >
              <Text style={styles.textoBotao}>Devolver</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Empréstimos',
        headerStyle: { backgroundColor: '#344955' },
        headerTintColor: '#fff',
      }} />
      
      <View style={styles.container}>
        {carregando ? (
          <View style={styles.carregandoContainer}>
            <ActivityIndicator size="large" color="#344955" />
            <Text style={styles.carregandoTexto}>Carregando...</Text>
          </View>
        ) : emprestimos.length === 0 ? (
          <View style={styles.semDadosContainer}>
            <Text style={styles.semDadosTexto}>Nenhum empréstimo registrado.</Text>
            <TouchableOpacity style={styles.botaoPrimario} onPress={abrirModal}>
              <Text style={styles.textoBotaoPrimario}>Registrar Novo Empréstimo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={emprestimos}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.lista}
          />
        )}
        
        <TouchableOpacity 
          style={styles.botaoAdicionar}
          onPress={abrirModal}
        >
          <MaterialIcons name="add" size={30} color="#fff" />
        </TouchableOpacity>
        
        {/* Modal para novo empréstimo */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitulo}>Novo Empréstimo</Text>
              
              <ScrollView style={styles.formContainer}>
                <Text style={styles.label}>Livro*</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={livroId}
                    onValueChange={(itemValue) => setLivroId(Number(itemValue))}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um livro" value="0" />
                    {livros.map(livro => (
                      <Picker.Item key={livro.id} label={livro.titulo} value={livro.id} />
                    ))}
                  </Picker>
                </View>
                
                <Text style={styles.label}>Aluno*</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={alunoId}
                    onValueChange={(itemValue) => setAlunoId(Number(itemValue))}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um aluno" value="0" />
                    {alunos.map(aluno => (
                      <Picker.Item key={aluno.id} label={aluno.nome} value={aluno.id} />
                    ))}
                  </Picker>
                </View>
                
                <Text style={styles.label}>Data do Empréstimo*</Text>
                <TextInput
                  style={styles.input}
                  value={dataEmprestimo}
                  onChangeText={setDataEmprestimo}
                  placeholder="AAAA-MM-DD"
                />
                
                <Text style={styles.label}>Data Prevista para Devolução*</Text>
                <TextInput
                  style={styles.input}
                  value={dataDevolucaoPrevista}
                  onChangeText={setDataDevolucaoPrevista}
                  placeholder="AAAA-MM-DD"
                />
                
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={observacoes}
                  onChangeText={setObservacoes}
                  placeholder="Observações adicionais"
                  multiline
                  numberOfLines={4}
                />
              </ScrollView>
              
              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoCancelar]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textoBotao}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.botao, styles.botaoSalvar]}
                  onPress={salvarEmprestimo}
                >
                  <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Modal para devolução */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDevolucaoVisible}
          onRequestClose={() => setModalDevolucaoVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitulo}>Registrar Devolução</Text>
              
              {emprestimoAtual && (
                <View style={styles.devolucaoInfo}>
                  <Text style={styles.devolucaoLivro}>{emprestimoAtual.livroTitulo}</Text>
                  <Text style={styles.devolucaoAluno}>Aluno: {emprestimoAtual.alunoNome}</Text>
                  <Text>Emprestado em: {formatarData(emprestimoAtual.dataEmprestimo)}</Text>
                  <Text>Devolução prevista: {formatarData(emprestimoAtual.dataDevolucaoPrevista)}</Text>
                </View>
              )}
              
              <Text style={styles.label}>Data da Devolução*</Text>
              <TextInput
                style={styles.input}
                value={dataDevolucao}
                onChangeText={setDataDevolucao}
                placeholder="AAAA-MM-DD"
              />
              
              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoCancelar]}
                  onPress={() => setModalDevolucaoVisible(false)}
                >
                  <Text style={styles.textoBotao}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.botao, styles.botaoDevolver]}
                  onPress={registrarDevolucao}
                >
                  <Text style={styles.textoBotao}>Confirmar Devolução</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carregandoTexto: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
  },
  semDadosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  semDadosTexto: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  botaoPrimario: {
    backgroundColor: '#344955',
    padding: 12,
    borderRadius: 8,
  },
  textoBotaoPrimario: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lista: {
    paddingBottom: 80,
  },
  emprestimoItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emprestimoAtrasado: {
    borderLeftWidth: 5,
    borderLeftColor: '#F44336',
  },
  emprestimoInfo: {
    flex: 1,
  },
  tituloEmprestimo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#344955',
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
  },
  statusEmprestado: {
    backgroundColor: '#2196F3',
  },
  statusDevolvido: {
    backgroundColor: '#4CAF50',
  },
  statusAtrasado: {
    backgroundColor: '#F44336',
  },
  botoesAcao: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  botao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoDevolver: {
    backgroundColor: '#2196F3',
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  botaoCancelar: {
    backgroundColor: '#9E9E9E',
    flex: 1,
    marginRight: 8,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F9AA33',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#344955',
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  devolucaoInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  devolucaoLivro: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#344955',
  },
  devolucaoAluno: {
    fontSize: 14,
    marginBottom: 4,
  },
}); 
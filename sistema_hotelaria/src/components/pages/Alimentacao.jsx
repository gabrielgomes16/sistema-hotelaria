import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'; // <-- NOVO: Importando Modal
import AlimentacaoLista from './AlimentacaoLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import InputGroup from 'react-bootstrap/InputGroup';

function Alimentacao() {
  const [quarto, setQuarto                ] = useState('');
  const [prato, setPrato                  ] = useState('');
  const [preco, setPreco                  ] = useState('');
  const [quantidade, setQuantidade        ] = useState('');
  const [observacoes, setObservacoes      ] = useState('');
  const [quartos, setQuartos              ] = useState([]);
  const [alimentacao, setAlimentacao      ] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  const [opcoesPratos, setOpcoesPratos] = useState(() => {
    const pratosSalvos = localStorage.getItem('cardapioHotel');
    if (pratosSalvos) {
      return JSON.parse(pratosSalvos);
    }
    return [
      { id: 'macarrao', nome: 'Macarrão', precoPadrao: 25.00 },
      { id: 'executivo', nome: 'Executivo', precoPadrao: 30.00 },
      { id: 'hamburguer', nome: 'Hambúrguer', precoPadrao: 20.00 },
      { id: 'pizza', nome: 'Pizza', precoPadrao: 45.00 }
    ];
  });

  const [showModalPrato, setShowModalPrato] = useState(false);
  const [novoPratoNome, setNovoPratoNome] = useState('');
  const [novoPratoPreco, setNovoPratoPreco] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alimentacaoRes, quartosRes] = await Promise.all([
          fetch('http://localhost:3000/alimentacao/'),
          fetch('http://localhost:3000/quartos/')
        ]);

        if (!alimentacaoRes.ok || !quartosRes.ok) {
          throw new Error('HTTP error!');
        }

        const alimentacaoData = await alimentacaoRes.json();
        const quartosData = await quartosRes.json();

        setAlimentacao(alimentacaoData);
        setQuartos(quartosData);

        console.log("Dados carregados");
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [carregaPagina]);

  const handleQuarto = (event) => {
    const id = event.target.value;
    setQuarto(id);
  };

  const handlePrato = (event) => {
    const pratoSelecionadoId = event.target.value;
    setPrato(pratoSelecionadoId);

    const pratoEncontrado = opcoesPratos.find(p => p.id === pratoSelecionadoId);
    if (pratoEncontrado) {
      setPreco(pratoEncontrado.precoPadrao);
    } else {
      setPreco('');
    }
  };

  const handlePreco= (event) => {
    setPreco(event.target.value);
  };

  const handleQuantidade= (event) => {
    setQuantidade(event.target.value);
  };

  const handleObservacoes = (event) => {
    setObservacoes(event.target.value);
  };

  const adicionarNovoPrato = () => {
    if (!novoPratoNome || !novoPratoPreco) {
        alert("Preencha o nome e o preço do prato!");
        return;
    }

    const novoId = novoPratoNome.toLowerCase().replace(/\s+/g, '');
    
    const novoPratoObj = {
        id: novoId,
        nome: novoPratoNome,
        precoPadrao: parseFloat(novoPratoPreco)
    };

    const novaListaPratos = [...opcoesPratos, novoPratoObj];
    
    // Atualiza o estado
    setOpcoesPratos(novaListaPratos);
    
    // Salva no localStorage para não perder ao recarregar a página
    localStorage.setItem('cardapioHotel', JSON.stringify(novaListaPratos));

    // Fecha o modal e limpa os campos
    setShowModalPrato(false);
    setNovoPratoNome('');
    setNovoPratoPreco('');
    
    setPrato(novoId);
    setPreco(novoPratoObj.precoPadrao);
  };

  const salvarPedido = async (e) => {
    e.preventDefault();
    try {
      if (!prato || !quarto ) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const pratoSelecionado = opcoesPratos.find(p => p.id === prato);
      const nomeDoPratoParaSalvar = pratoSelecionado ? pratoSelecionado.nome : prato;

      const dataToSend = {
        id_quarto: parseInt(quarto),
        prato: nomeDoPratoParaSalvar,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        observacoes: observacoes
      };

      await axios.post('http://localhost:3000/alimentacao/', dataToSend);

      setQuarto('');
      setPrato('');
      setPreco('');
      setQuantidade('');
      setObservacoes('');
      setCarregaPagina(!carregaPagina);

    } catch (error) {
      console.error('Error during POST request:', error);
    }
  };

  const handleSelecao = (id) => {
    console.log(id);
    axios.get('http://localhost:3000/alimentacao/' + id)
      .then((response) => {
        setQuarto(response.data['id_quarto']);
        setPrato(response.data['prato'].toLowerCase().replace(/\s+/g, '')); 
        setPreco(response.data['preco']);
        setQuantidade(response.data['quantidade']);
        setObservacoes(response.data['observacoes']);
      });
  };

  const deletarPedido = (id) => {
    axios.delete('http://localhost:3000/alimentacao/' + id)
      .then(() => {
        setCarregaPagina(!carregaPagina);
        setQuarto(''); setPrato(''); setPreco(''); setQuantidade(''); setObservacoes('');
      })
      .catch((error) => console.error('Erro ao deletar pedido:', error));
  };

  return (
    <>
      <Card>
        <Card.Header className="card-header bg-success text-white">
          <h1>Pedidos de Alimentação</h1>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group controlId="formQuarto">
                  <Form.Label>Quarto *</Form.Label>
                  <Form.Select onChange={handleQuarto} value={quarto}>
                    <option value="">Selecione um quarto</option>
                    {quartos.filter(q => q.status === 'ocupado').map((q) => (
                      <option key={q.id_quarto} value={q.id_quarto}>
                        Quarto {q.numero} - {q.tipo} 
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col sm={3}>
                <Form.Group className="col-md3" controlId="formBasicTipo">
                  <Form.Label>Prato</Form.Label>
                  <div className="d-flex gap-2">
                      <Form.Select onChange={handlePrato} value={prato}>
                        <option value="">Selecione o prato</option>
                        {opcoesPratos.map((opcao) => (
                            <option key={opcao.id} value={opcao.id}>
                                {opcao.nome}
                            </option>
                        ))}
                      </Form.Select>
                      <Button variant="outline-success" onClick={() => setShowModalPrato(true)}>
                          +
                      </Button>
                  </div>
                </Form.Group>
              </Col>

              <Col sm={3}>
                <Form.Group className="col-md3" controlId="formBasicPreco">
                  <Form.Label>Preço Unitário</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="moeda-addon">R$</InputGroup.Text>
                  <Form.Control type="number" placeholder="Preço" onChange={handlePreco} value={preco} step="0.01"/>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col sm={3}>
                <Form.Group className="col-md3" controlId="formBasicQuantidade">
                  <Form.Label>Quantidade</Form.Label>
                  <Form.Control type="number" placeholder="Quantidade" onChange={handleQuantidade} value={quantidade} min="1" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col sm={12}>
                <Form.Group controlId="formObservacoes">
                  <Form.Label>Observações</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Ex: Sem cebola, bem passado..." 
                    onChange={handleObservacoes} 
                    value={observacoes}
                  />
                </Form.Group>
              </Col>
            </Row>

            <br></br>
            <Button variant="success" onClick={salvarPedido}>
              Salvar Pedido
            </Button>
            
            <hr className="mt-4"/>

            <AlimentacaoLista 
              data={alimentacao} 
              quartos={quartos}
              handleSelecao={handleSelecao}
              deletarPedido={deletarPedido}
            />
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showModalPrato} onHide={() => setShowModalPrato(false)}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Cadastrar Novo Prato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Prato</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Filé a Parmegiana" 
                value={novoPratoNome}
                onChange={(e) => setNovoPratoNome(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preço Padrão</Form.Label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={novoPratoPreco}
                  onChange={(e) => setNovoPratoPreco(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalPrato(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={adicionarNovoPrato}>
            Salvar no Cardápio
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Alimentacao;
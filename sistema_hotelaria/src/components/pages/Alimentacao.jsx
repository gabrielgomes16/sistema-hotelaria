import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'; 
import AlimentacaoLista from './AlimentacaoLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import InputGroup from 'react-bootstrap/InputGroup';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Alimentacao() {
  const [idAlimentacao, setIdAlimentacao  ] = useState(0);
  const [quarto, setQuarto                ] = useState('');
  const [prato, setPrato                  ] = useState('');
  const [preco, setPreco                  ] = useState('');
  const [quantidade, setQuantidade        ] = useState('');
  const [observacoes, setObservacoes      ] = useState('');
  const [quartos, setQuartos              ] = useState([]);
  const [alimentacao, setAlimentacao      ] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  const [opcoesPratos, setOpcoesPratos] = useState([]);

  const [showModalPrato, setShowModalPrato] = useState(false);
  const [novoPratoNome, setNovoPratoNome] = useState('');
  const [novoPratoPreco, setNovoPratoPreco] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alimentacaoRes, quartosRes, cardapioRes] = await Promise.all([
          fetch(`${API_URL}/alimentacao`),
          fetch(`${API_URL}/quartos`),
          fetch(`${API_URL}/cardapio`)
        ]);

        if (!alimentacaoRes.ok || !quartosRes.ok || !cardapioRes.ok) {
          throw new Error('HTTP error!');
        }

        const alimentacaoData = await alimentacaoRes.json();
        const quartosData = await quartosRes.json();
        const cardapioData = await cardapioRes.json();

        setAlimentacao(alimentacaoData);
        setQuartos(quartosData);
        setOpcoesPratos(cardapioData);

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

    const pratoEncontrado = opcoesPratos.find(p => p.id_cardapio === parseInt(pratoSelecionadoId));
    if (pratoEncontrado) {
      setPreco(pratoEncontrado.preco);
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

  const limparFormulario = () => {
      setIdAlimentacao(0);
      setQuarto('');
      setPrato('');
      setPreco('');
      setQuantidade('');
      setObservacoes('');
  };

  const adicionarNovoPrato = async () => {
    if (!novoPratoNome || !novoPratoPreco) {
        alert("Preencha o nome e o preço do prato!");
        return;
    }

    try {
      const response = await axios.post(`${API_URL}/cardapio`, {
        nome: novoPratoNome,
        preco: parseFloat(novoPratoPreco)
      });

      const novoPrato = response.data;

      setOpcoesPratos([...opcoesPratos, novoPrato]);

      setShowModalPrato(false);
      setNovoPratoNome('');
      setNovoPratoPreco('');

      setPrato(String(novoPrato.id_cardapio));
      setPreco(novoPrato.preco);
    } catch (error) {
      console.error('Erro ao salvar prato:', error);
      alert('Erro ao salvar o prato no cardápio.');
    }
  };

  const salvarPedido = async (e) => {
    e.preventDefault();
    try {
      if (!prato || !quarto ) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const pratoSelecionado = opcoesPratos.find(p => p.id_cardapio === parseInt(prato));
      const nomeDoPratoParaSalvar = pratoSelecionado ? pratoSelecionado.nome : prato;

      const dataToSend = {
        id_quarto: parseInt(quarto),
        prato: nomeDoPratoParaSalvar,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        observacoes: observacoes
      };

      if (idAlimentacao > 0) {
          axios.put(`${API_URL}/alimentacao/${idAlimentacao}`, dataToSend)
          .then(function (response) {
            console.log('Pedido atualizado:', response.data);
            limparFormulario();
            setCarregaPagina(!carregaPagina);
          })
          .catch(function (error) {
            console.error('Erro ao atualizar:', error);
          });
      } else {
          axios.post(`${API_URL}/alimentacao`, dataToSend)
          .then(function (response) {
            console.log('Success:', response.data);
            limparFormulario();
            setCarregaPagina(!carregaPagina);
          })
          .catch(function (error) {
            console.error('Erro ao criar:', error);
          });
      }

    } catch (error) {
      console.error('Error during request:', error);
    }
  };

  const handleSelecao = (id) => {
    console.log(id);
    axios.get(`${API_URL}/alimentacao/${id}`)
      .then((response) => {
        setIdAlimentacao(response.data['id_alimentacao']);
        setQuarto(response.data['id_quarto']);
        const pratoNome = response.data['prato'];
        const pratoEncontrado = opcoesPratos.find(p => p.nome === pratoNome);
        setPrato(pratoEncontrado ? String(pratoEncontrado.id_cardapio) : '');
        setPreco(response.data['preco']);
        setQuantidade(response.data['quantidade']);
        setObservacoes(response.data['observacoes']);
      });
  };

  const deletarPedido = (id) => {
    if (!window.confirm('Confirmar exclusão?')) return;
    console.log("Deletando pedido:", id);
    axios.delete(`${API_URL}/alimentacao/${id}`)
      .then((response) => {
        console.log('Pedido deletada com sucesso:', response.data);
        limparFormulario();
        setCarregaPagina(!carregaPagina);
      })
      .catch((error) => console.error('Erro ao deletar pedido:', error));
  };

  return (
    <>
      <Card>
        <Card.Header className="card-header bg-success text-white">
          <h1>Pedidos da Cozinha</h1>
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
                            <option key={opcao.id_cardapio} value={opcao.id_cardapio}>
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
              {idAlimentacao > 0 ? 'Atualizar Pedido' : 'Salvar Pedido'}
            </Button>
            {' '}
            <Button variant="secondary" onClick={limparFormulario}>
              Limpar
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
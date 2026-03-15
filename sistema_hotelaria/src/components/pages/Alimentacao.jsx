import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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

    return () => {
      // Cleanup logic here
    };
  }, [carregaPagina]);



  const handleQuarto = (event) => {
    const id = event.target.value;
    setQuarto(id);
  };

  const handlePrato= (event) => {
    setPrato(event.target.value);
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

  const salvarPedido = async (e) => {
    e.preventDefault();
    try {
      if (!prato || !quarto ) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const dataToSend = {
        id_quarto: parseInt(quarto),
        prato: prato,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        observacoes: observacoes
      };

      axios.post('http://localhost:3000/alimentacao/', dataToSend)
        .then(function (response) {
          console.log('Success:', response.data);
        });

      setQuarto('');
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
        setPrato(response.data['prato']);
        setPreco(response.data['preco']);
        setQuantidade(response.data['quantidade']);
        setObservacoes(response.data['observacoes']);
        console.log(response);
      });
  };

  const deletarPedido = (id) => {
    console.log("Deletando pedido:", id);
    axios.delete('http://localhost:3000/alimentacao/' + id)
      .then((response) => {
        console.log('Pedido deletada com sucesso:', response.data);
        setCarregaPagina(!carregaPagina);
        setQuarto('');
        setPrato('');
        setPreco('');
        setQuantidade('');
        setObservacoes('');
      })
      .catch((error) => {
        console.error('Erro ao deletar pedido:', error);
      });
  };

  return (
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
                  {quartos.filter(q => q.status === 'disponível').map((q) => (
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
                <Form.Select onChange={handlePrato} value={prato}>
                  <option value="">Selecione o prato</option>
                  <option value="macarrao">Macarrão</option>
                  <option value="executivo">Executivo</option>
                  <option value="hamburguer">Hambúrguer</option>
                  <option value="pizza">Pizza</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicPreco">
                <Form.Label>Preço</Form.Label>
                <InputGroup>
                  <InputGroup.Text id="moeda-addon">R$</InputGroup.Text>
                <Form.Control type="number" placeholder="Preço" onChange={handlePreco} value={preco} step="0.01"/>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicQuantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control type="number" placeholder="Quantidade" onChange={handleQuantidade} value={quantidade} />
              </Form.Group>
            </Col>
            <Col sm={3}>

            </Col>
            <Col sm={2}>

            </Col>
            <Col sm={4}>

            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <Form.Group controlId="formObservacoes">
                <Form.Label>Observações</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Observações adicionais" 
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
          <AlimentacaoLista 
            data={alimentacao} 
            quartos={quartos}
            handleSelecao={handleSelecao}
            deletarPedido={deletarPedido}
          />
        </Form>
      </Card.Body>

    </Card>
  );
}

export default Alimentacao;

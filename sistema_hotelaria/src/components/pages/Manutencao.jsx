import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ManutencaoLista from './ManutencaoLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import InputGroup from 'react-bootstrap/InputGroup';

function Manutencao() {
  const [quarto, setQuarto                ] = useState('');
  const [problema, setProblema            ] = useState('');
  const [preco, setPreco                  ] = useState('');
  const [observacoes, setObservacoes      ] = useState('');
  const [quartos, setQuartos              ] = useState([]);
  const [manutencao, setManutencao        ] = useState([]);
  const [carregaPagina, setCarregaPagina  ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manutencaoRes, quartosRes] = await Promise.all([
          fetch('http://localhost:3000/manutencao/'),
          fetch('http://localhost:3000/quartos/')
        ]);

        if (!manutencaoRes.ok || !quartosRes.ok) {
          throw new Error('HTTP error!');
        }

        const manutencaoData = await manutencaoRes.json();
        const quartosData = await quartosRes.json();

        setManutencao(manutencaoData);
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

  const handleProblema= (event) => {
    setProblema(event.target.value);
  };

  const handlePreco= (event) => {
    setPreco(event.target.value);
  };

  const handleObservacoes = (event) => {
    setObservacoes(event.target.value);
  };

  const salvarPedido = async (e) => {
    e.preventDefault();
    try {
      if (!problema || !quarto ) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const dataToSend = {
        id_quarto: parseInt(quarto),
        problema: problema,
        preco: parseFloat(preco),
        observacoes: observacoes
      };

      axios.post('http://localhost:3000/manutencao/', dataToSend)
        .then(function (response) {
          console.log('Success:', response.data);
        });

      setQuarto('');
      setPreco('');
      setObservacoes('');
      setCarregaPagina(!carregaPagina);

    } catch (error) {
      console.error('Error during POST request:', error);
    }
  };

  const handleSelecao = (id) => {
    console.log(id);
    axios.get('http://localhost:3000/manutencao/' + id)
      .then((response) => {
        setQuarto(response.data['id_quarto']);
        setProblema(response.data['problema']);
        setPreco(response.data['preco']);
        setObservacoes(response.data['observacoes']);
        console.log(response);
      });
  };

  const deletarPedido = (id) => {
    console.log("Deletando pedido:", id);
    axios.delete('http://localhost:3000/manutencao/' + id)
      .then((response) => {
        console.log('Pedido deletada com sucesso:', response.data);
        setCarregaPagina(!carregaPagina);
        setQuarto('');
        setProblema('');
        setPreco('');
        setObservacoes('');
      })
      .catch((error) => {
        console.error('Erro ao deletar pedido:', error);
      });
  };

  return (
    <Card>
      <Card.Header className="card-header bg-success text-white">
        <h1>Pedidos de Manutenção</h1>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col sm={6}>
              <Form.Group controlId="formQuarto">
                <Form.Label>Quarto *</Form.Label>
                <Form.Select onChange={handleQuarto} value={quarto}>
                  <option value="">Selecione um quarto</option>
                  {quartos.filter(q => (q.status || 'disponível') === 'disponível').map((q) => (
                    <option key={q.id_quarto} value={q.id_quarto}>
                      Quarto {q.numero} - {q.tipo} 
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicTipo">
                <Form.Label>Problema</Form.Label>
                <Form.Select onChange={handleProblema} value={problema}>
                  <option value="">Selecione o Prolema</option>
                  <option value="ar-condicionado">Ar-condicionado</option>
                  <option value="chuveiro">Chuveiro</option>
                  <option value="energia">Energia</option>
                  <option value="água">Água</option>
                  <option value="outro">Outro</option>
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
          <ManutencaoLista 
            data={manutencao} 
            quartos={quartos}
            handleSelecao={handleSelecao}
            deletarPedido={deletarPedido}
          />
        </Form>
      </Card.Body>

    </Card>
  );
}

export default Manutencao;

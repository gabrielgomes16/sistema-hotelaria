import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LimpezaLista from './LimpezaLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import InputGroup from 'react-bootstrap/InputGroup';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Limpeza() {
  const [idLimpeza, setIdLimpeza          ] = useState(0);
  const [quarto, setQuarto                ] = useState('');
  const [tipo, setTipo                    ] = useState('');
  const [observacoes, setObservacoes      ] = useState('');
  const [quartos, setQuartos              ] = useState([]);
  const [limpeza, setLimpeza      ] = useState([]);
  const [carregaPagina, setCarregaPagina  ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [limpezaRes, quartosRes] = await Promise.all([
          fetch(`${API_URL}/limpeza`),
          fetch(`${API_URL}/quartos`)
        ]);

        if (!limpezaRes.ok || !quartosRes.ok) {
          throw new Error('HTTP error!');
        }

        const limpezaData = await limpezaRes.json();
        const quartosData = await quartosRes.json();

        setLimpeza(limpezaData);
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

  const handleTipo= (event) => {
    setTipo(event.target.value);
  };

  const handleObservacoes = (event) => {
    setObservacoes(event.target.value);
  };

  const limparFormulario = () => {
      setIdLimpeza(0);
      setQuarto('');
      setTipo('');
      setObservacoes('');
  };

  const salvarPedido = async (e) => {
    e.preventDefault();
    try {
      if (!tipo || !quarto ) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const dataToSend = {
        id_quarto: parseInt(quarto),
        tipo: tipo,
        observacoes: observacoes
      };

      if (idLimpeza > 0) {
          axios.put(`${API_URL}/limpeza/${idLimpeza}`, dataToSend)
          .then(function (response) {
            console.log('Pedido atualizado:', response.data);
            limparFormulario();
            setCarregaPagina(!carregaPagina);
          })
          .catch(function (error) {
            console.error('Erro ao atualizar:', error);
          });
      } else {
          axios.post(`${API_URL}/limpeza`, dataToSend)
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
    axios.get(`${API_URL}/limpeza/${id}`)
      .then((response) => {
        setIdLimpeza(response.data['id_limpeza']);
        setQuarto(response.data['id_quarto']);
        setTipo(response.data['tipo']);
        setObservacoes(response.data['observacoes']);
        console.log(response);
      });
  };

  const deletarPedido = (id) => {
    if (!window.confirm('Confirmar exclusão?')) return;
    console.log("Deletando pedido:", id);
    axios.delete(`${API_URL}/limpeza/${id}`)
      .then((response) => {
        console.log('Pedido deletada com sucesso:', response.data);
        limparFormulario();
        setCarregaPagina(!carregaPagina);
      })
      .catch((error) => {
        console.error('Erro ao deletar pedido:', error);
      });
  };

  return (
    <Card>
      <Card.Header className="card-header bg-success text-white">
        <h1>Pedidos de Limpeza</h1>
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
            <Col sm={6}>
              <Form.Group className="col-md3" controlId="formBasicTipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Select onChange={handleTipo} value={tipo}>
                  <option value="">Selecione o Tipo</option>
                  <option value="basica">Básica</option>
                  <option value="Pesada">Pesada</option>
                  <option value="Só banheiro">Só banheiro</option>
                  <option value="Só cama">Só cama</option>
                  <option value="outro">Outro</option>
                </Form.Select>
              </Form.Group>
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
            {idLimpeza > 0 ? 'Atualizar Pedido' : 'Salvar Pedido'}
          </Button>
          {' '}
          <Button variant="secondary" onClick={limparFormulario}>
            Limpar
          </Button>
          <LimpezaLista 
            data={limpeza} 
            quartos={quartos}
            handleSelecao={handleSelecao}
            deletarPedido={deletarPedido}
          />
        </Form>
      </Card.Body>

    </Card>
  );
}

export default Limpeza;

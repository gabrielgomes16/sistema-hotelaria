import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import QuartosLista from './QuartosLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Quartos() {
  const [idQuarto, setIdQuarto    ] = useState(0);
  const [numero, setNumero        ] = useState('');
  const [tipo, setTipo            ] = useState('');
  const [preco, setPreco          ] = useState('');
  const [descricao, setDescricao  ] = useState('');
  const [status, setStatus        ] = useState('disponível');
  const [quartos, setQuartos      ] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/quartos`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setQuartos(result);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("FINALLY")
      }
    };

    fetchData();

    return () => {
      // Cleanup logic here
    };
  }, [carregaPagina]);

  const limparFormulario = () => {
      setIdQuarto(0);
      setNumero('');
      setTipo('');
      setPreco('');
      setDescricao('');
      setStatus('disponível');
  };

  const salvarQuarto = async (e) => {
      e.preventDefault();
      try {
          const dataToSend = {
              numero: numero,
              tipo: tipo,
              preco: parseFloat(preco),
              descricao: descricao,
              status: status || 'disponível'
          };

          if (idQuarto > 0) {
              axios.put(`${API_URL}/quartos/${idQuarto}`, dataToSend)
              .then(function (response) {
                console.log('Quarto atualizado:', response.data);
                limparFormulario();
                setCarregaPagina(!carregaPagina);
              })
              .catch(function (error) {
                console.error('Erro ao atualizar:', error);
              });
          } else {
              axios.post(`${API_URL}/quartos`, dataToSend)
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

  const handleNumero = (event) => {
      setNumero(event.target.value);
  }

  const handleTipo = (event) => {
      setTipo(event.target.value);
  }

  const handlePreco = (event) => {
      setPreco(event.target.value);
  }

  const handleDescricao = (event) => {
      setDescricao(event.target.value);
  }

  const handleSelecao = (id) => {
    console.log(id);
    axios.get(`${API_URL}/quartos/${id}`)
    .then((response) => {
      setIdQuarto(response.data['id_quarto']);
      setNumero(response.data['numero']);
      setTipo(response.data['tipo']);
      setPreco(response.data['preco']);
      setDescricao(response.data['descricao']);
      setStatus(response.data['status']);
      console.log(response);
    });
  }

  const deletarQuarto = (id) => {
    if (!window.confirm('Confirmar exclusão?')) return;
    console.log("Deletando quarto:", id);
    axios.delete(`${API_URL}/quartos/${id}`)
    .then((response) => {
      console.log('Quarto deletado com sucesso:', response.data);
      limparFormulario();
      setCarregaPagina(!carregaPagina);
    })
    .catch((error) => {
      console.error('Erro ao deletar quarto:', error);
    });
  }

  return (
    <Card>
      <Card.Header className="card-header bg-primary text-white">
        <h1>Cadastro de Quartos</h1>
      </Card.Header>
      <Card.Body>

        <Form>
          <Row>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicNumero">
                <Form.Label>Número</Form.Label>
                <Form.Control type="text" placeholder="Número" onChange={handleNumero} value={numero}/>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicTipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Select onChange={handleTipo} value={tipo}>
                  <option value="">Selecione o tipo</option>
                  <option value="solteiro">Solteiro</option>
                  <option value="casal">Casal</option>
                  <option value="duplo">Duplo</option>
                  <option value="suite">Suite</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicPreco">
                <Form.Label>Preço</Form.Label>
                <Form.Control type="number" placeholder="Preço" onChange={handlePreco} value={preco} step="0.01"/>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control type="text" value={status || 'disponível'} disabled />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Form.Group className="col-md12" controlId="formBasicDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Descrição" onChange={handleDescricao} value={descricao}/>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Button variant="primary" onClick={salvarQuarto}>
            {idQuarto > 0 ? 'Atualizar' : 'Salvar'}
          </Button>
          {' '}
          <Button variant="secondary" onClick={limparFormulario}>
            Limpar
          </Button>
          <QuartosLista 
            data={quartos} 
            handleSelecao={handleSelecao} 
            deletarQuarto={deletarQuarto}
          />
        </Form>
      </Card.Body>

    </Card>
  );
}

export default Quartos;

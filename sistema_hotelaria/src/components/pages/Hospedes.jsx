import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import HospedesLista from './HospedesLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import { cpfMask, cepMask } from '../utils/Utils';

function Hospedes() {
  const [idHospede, setIdHospede] = useState(0);
  const [nome, setNome        ] = useState('');
  const [email, setEmail      ] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf          ] = useState('');
  const [cep, setCep          ] = useState('');
  const [rua, setRua          ] = useState('');
  const [numero, setNumero    ] = useState(0);
  const [hospedes, setHospedes] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //setLoading(true); // Set loading state before fetching
        const response = await fetch('http://localhost:3000/hospedes/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setHospedes(result);
        //setData(result);
      } catch (err) {
        //setError(err);
        console.log(err);
      }
    };

    fetchData(); // Call the async function

    // Optional: Cleanup function if needed (e.g., to cancel ongoing requests)
    return () => {
      // Cleanup logic here
    };
  }, [carregaPagina]); // Empty dependency array means this effect runs once on mount



  const salvarHospedes = async (e) => {
      console.log('ID atual:', idHospede);
      e.preventDefault();
      try {
          const dataToSend = {
              nome: nome,
              email: email,
              telefone: telefone,
              cpf: cpf
          };
          
          // Se ID existe e é maior que 0, atualiza (PUT), senão cria novo (POST)
          if (idHospede && idHospede > 0) {
              // Atualizar hospede existente
              axios.put(`http://localhost:3000/hospedes/${idHospede}`, dataToSend)
              .then(function (response) {
                console.log('Hospede atualizado:', response.data);
                setCarregaPagina(!carregaPagina);
              })
              .catch(function (error) {
                console.error('Erro ao atualizar:', error);
              });
          } else {
              // Criar novo hospede
              axios.post('http://localhost:3000/hospedes/', dataToSend)
              .then(function (response) {
                console.log('Novo hospede criado:', response.data);
                limparFormulario();
                setCarregaPagina(!carregaPagina);
              })
              .catch(function (error) {
                console.error('Erro ao criar:', error);
              });
          }
          
          } catch (error) {
            console.error('Erro durante requisição:', error);
      }

  };

  const limparFormulario = () => {
      setIdHospede(0);
      setNome('');
      setEmail('');
      setTelefone('');
      setCpf('');
      setCep('');
      setRua('');
      setNumero(0);
  };



  const handleEmail = (event) => {
      setEmail(event.target.value);
  }

  const handleTelefone = (event) => {
      setTelefone(event.target.value);
  }

  const handleNome = (event) => {
      setNome(event.target.value);
  }

  const handleCpf = (event) => {
      setCpf(cpfMask(event.target.value));
  }

  const handleCep = (event) => {
      setCep(cepMask(event.target.value));
  }

  const handleRua = (event) => {
      setRua(event.target.value);
  }


  const handleFillAddress = () =>{
    console.log("Voce saiu do cep");
    console.log(cep);
    let cepSemTraco = '';
    cepSemTraco = cep;
    cepSemTraco = cepSemTraco.replace('-', "");
    console.log(cepSemTraco);
    // Buscando os dados do endereco, a partir do cep
    axios.get('http://viacep.com.br/ws/' + cepSemTraco + '/json/')
    .then(function (response){
      setRua(response.data['logradouro']);
      console.log(response);
    });
  }


  const handleSelecao = (id) => {
    console.log('Selecionando hospede com ID:', id);
    axios.get('http://localhost:3000/hospedes/'+id)
    .then((response) => {
      setIdHospede(response.data['id_hospede']);
      setNome(response.data['nome']);
      setEmail(response.data['email']);
      setTelefone(response.data['telefone']);
      setCpf(response.data['cpf'] || '');
      setCep(response.data['cep'] || '');
      setRua(response.data['rua'] || '');
      setNumero(response.data['numero'] || 0);
      console.log('Hospede carregado:', response.data);
    })
    .catch((error) => {
      console.error('Erro ao carregar hospede:', error);
    });
  }

  const excluirHospede = () => {
    if (idHospede && idHospede > 0) {
      axios.delete(`http://localhost:3000/hospedes/${idHospede}`)
      .then(function (response) {
        console.log('Hospede excluido:', response.data);
        limparFormulario();
        setCarregaPagina(!carregaPagina);
      })
      .catch(function (error) {
        console.error('Erro ao excluir:', error);
      });
    } else {
      console.warn('Nenhum hospede selecionado para exclusão.');
    }
  }

  return (
    <React.Fragment>

      <Card>
        <Card.Header className="card-header bg-primary text-white">
          <h1>Cadastro de Hóspedes</h1>
        </Card.Header>
        <Card.Body>

        <Form>
          <Row>
            <Col sm={6}>
              <Form.Group className="col-md3" controlId="formBasicNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Nome" onChange={handleNome} value={nome}/>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" onChange={handleEmail} value={email}/>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control type="text" placeholder="Telefone" onChange={handleTelefone} value={telefone}/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formCpf">
                <Form.Label>CPF</Form.Label>
                <Form.Control type="text" placeholder="CPF" 
                              onChange={handleCpf} value={cpf}/>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="col-md3" controlId="formCep">
                <Form.Label>CEP</Form.Label>
                <Form.Control type="text" placeholder="CEP" 
                              onChange={handleCep} value={cep}
                              onBlur={handleFillAddress}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="col-md3" controlId="formRua">
                <Form.Label>Rua</Form.Label>
                <Form.Control type="text" placeholder="Rua" 
                              onChange={handleRua} value={rua}
                />
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <br></br>
          <Button variant="primary" onClick={salvarHospedes}>
            {idHospede > 0 ? 'Atualizar' : 'Salvar'}
          </Button>
          {' '}
          <Button variant="secondary" onClick={limparFormulario}>
            Limpar
          </Button>
          <Button variant="danger" onClick={excluirHospede}>
            Excluir
          </Button>

          <HospedesLista data={hospedes} handleSelecao={handleSelecao}/>
        </Form>
        </Card.Body>

      </Card>
    </React.Fragment>
  );
}

export default Hospedes;
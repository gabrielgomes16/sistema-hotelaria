import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'; // <-- NOVO: Importando Modal
import HospedagensLista from './HospedagensLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";

function Hospedagens() {
  const [hospede, setHospede              ] = useState('');
  const [quarto, setQuarto                ] = useState('');
  const [dataEntrada, setDataEntrada      ] = useState('');
  const [dataSaida, setDataSaida          ] = useState('');
  const [diarias, setDiarias              ] = useState(0);
  const [valorTotal, setValorTotal        ] = useState(0);
  const [observacoes, setObservacoes      ] = useState('');
  const [hospedes, setHospedes            ] = useState([]);
  const [quartos, setQuartos              ] = useState([]);
  const [hospedagens, setHospedagens      ] = useState([]);
  const [pedidosAlimentacao, setPedidosAlimentacao] = useState([]); // <-- NOVO: Estado para comidas
  const [carregaPagina, setCarregaPagina] = useState(false);

  // --- NOVOS ESTADOS PARA O CHECKOUT ---
  const [showCheckout, setShowCheckout] = useState(false);
  const [quartoCheckout, setQuartoCheckout] = useState('');
  const [dadosCheckout, setDadosCheckout] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // NOVO: Adicionei a rota de alimentação no Promise.all
        const [hospedagensRes, hospedesRes, quartosRes, alimentacaoRes] = await Promise.all([
          fetch('http://localhost:3000/hospedagens/'),
          fetch('http://localhost:3000/hospedes/'),
          fetch('http://localhost:3000/quartos/'),
          fetch('http://localhost:3000/alimentacao/')
        ]);

        if (!hospedagensRes.ok || !hospedesRes.ok || !quartosRes.ok || !alimentacaoRes.ok) {
          throw new Error('HTTP error!');
        }

        const hospedagensData = await hospedagensRes.json();
        const hospedesData = await hospedesRes.json();
        const quartosData = await quartosRes.json();
        const alimentacaoData = await alimentacaoRes.json();

        setHospedagens(hospedagensData);
        setHospedes(hospedesData);
        setQuartos(quartosData);
        setPedidosAlimentacao(alimentacaoData); // Salvando as comidas

      } catch (err) {
        console.log("Erro ao carregar dados: ", err);
      }
    };

    fetchData();
  }, [carregaPagina]);

  const calcularDiarias = (dataIn, dataSd) => {
    if (dataIn && dataSd) {
      const entrada = new Date(dataIn);
      const saida = new Date(dataSd);
      const diff = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
      setDiarias(diff > 0 ? diff : 0);
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const calcularValorTotal = (dataIn, dataSd, id_quarto) => {
    if (dataIn && dataSd && id_quarto) {
      const dias = calcularDiarias(dataIn, dataSd);
      const quartoSelecionado = quartos.find(q => q.id_quarto === parseInt(id_quarto));
      if (quartoSelecionado) {
        const total = dias * parseFloat(quartoSelecionado.preco);
        setValorTotal(total);
        return total;
      }
    }
    return 0;
  };

  const handleDataEntrada = (event) => {
    const data = event.target.value;
    setDataEntrada(data);
    if (dataSaida) calcularValorTotal(data, dataSaida, quarto);
  };

  const handleDataSaida = (event) => {
    const data = event.target.value;
    setDataSaida(data);
    if (dataEntrada) calcularValorTotal(dataEntrada, data, quarto);
  };

  const handleHospede = (event) => setHospede(event.target.value);
  
  const handleQuarto = (event) => {
    const id = event.target.value;
    setQuarto(id);
    if (dataEntrada && dataSaida) calcularValorTotal(dataEntrada, dataSaida, id);
  };

  const handleObservacoes = (event) => setObservacoes(event.target.value);

  const salvarHospedagem = async (e) => {
    e.preventDefault();
    try {
      if (!hospede || !quarto || !dataEntrada || !dataSaida) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const dataToSend = {
        id_hospede: parseInt(hospede),
        id_quarto: parseInt(quarto),
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        diarias: diarias,
        valorTotal: valorTotal,
        observacoes: observacoes
      };

      await axios.post('http://localhost:3000/hospedagens/', dataToSend);

      // DICA: Quando salvar a hospedagem, mude o status do quarto para "ocupado"
      const quartoAtual = quartos.find(q => q.id_quarto === parseInt(quarto));
      await axios.put(`http://localhost:3000/quartos/${quarto}`, {
          ...quartoAtual,
          status: 'ocupado'
      });

      setHospede(''); setQuarto(''); setDataEntrada(''); setDataSaida('');
      setDiarias(0); setValorTotal(0); setObservacoes('');
      setCarregaPagina(!carregaPagina);
      alert("Hospedagem salva e quarto ocupado!");

    } catch (error) {
      console.error('Error during POST request:', error);
    }
  };

  // --- LÓGICA DO CHECKOUT ---

  const handleQuartoCheckout = (event) => {
    const idQuartoSelecionado = event.target.value;
    setQuartoCheckout(idQuartoSelecionado);

    if (!idQuartoSelecionado) {
        setDadosCheckout(null);
        return;
    }

    // Acha a hospedagem deste quarto. 
    // OBS: Em um sistema real, seria a hospedagem mais recente ou com status "ativa".
    const hospedagemAtiva = hospedagens.find(h => h.id_quarto === parseInt(idQuartoSelecionado));
    
    if (hospedagemAtiva) {
        const hospedeAtivo = hospedes.find(h => h.id_hospede === hospedagemAtiva.id_hospede);
        
        // Calcula gastos com alimentação (Preço * Quantidade de todos os pedidos do quarto)
        const valorComidas = pedidosAlimentacao
            .filter(pedido => pedido.id_quarto === parseInt(idQuartoSelecionado))
            .reduce((acc, pedido) => acc + (parseFloat(pedido.preco) * parseInt(pedido.quantidade)), 0);

        setDadosCheckout({
            nomeHospede: hospedeAtivo ? hospedeAtivo.nome : 'Desconhecido',
            valorQuarto: parseFloat(hospedagemAtiva.valorTotal),
            valorAlimentacao: valorComidas,
            valorFinal: parseFloat(hospedagemAtiva.valorTotal) + valorComidas
        });
    } else {
        setDadosCheckout(null);
    }
  };

  const finalizarCheckout = async () => {
      try {
          const quartoAtual = quartos.find(q => q.id_quarto === parseInt(quartoCheckout));
          
          // Libera o quarto colocando status como 'disponível'
          await axios.put(`http://localhost:3000/quartos/${quartoCheckout}`, {
              ...quartoAtual,
              status: 'disponível'
          });

          alert("Checkout feito com sucesso! Quarto liberado.");
          
          // Fecha modal e reseta estados
          setShowCheckout(false);
          setQuartoCheckout('');
          setDadosCheckout(null);
          setCarregaPagina(!carregaPagina);

      } catch (error) {
          console.error("Erro ao fazer checkout:", error);
          alert("Ocorreu um erro ao fazer o checkout.");
      }
  };

  return (
    <>
      <Card>
        <Card.Header className="card-header bg-success text-white">
          <h1>Movimentação de Quartos e Hóspedes</h1>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group controlId="formHospede">
                  <Form.Label>Hóspede *</Form.Label>
                  <Form.Select onChange={handleHospede} value={hospede}>
                    <option value="">Selecione um hóspede</option>
                    {hospedes.map((h) => (
                      <option key={h.id_hospede} value={h.id_hospede}>
                        {h.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="formQuarto">
                  <Form.Label>Quarto *</Form.Label>
                  <Form.Select onChange={handleQuarto} value={quarto}>
                    <option value="">Selecione um quarto</option>
                    {/* Aqui mostra apenas quartos disponíveis */}
                    {quartos.filter(q => (q.status || 'disponível') === 'disponível').map((q) => (
                      <option key={q.id_quarto} value={q.id_quarto}>
                        Quarto {q.numero} - {q.tipo} (R$ {parseFloat(q.preco).toFixed(2)})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col sm={3}>
                <Form.Group controlId="formDataEntrada">
                  <Form.Label>Data Entrada *</Form.Label>
                  <Form.Control type="date" onChange={handleDataEntrada} value={dataEntrada} />
                </Form.Group>
              </Col>
              <Col sm={3}>
                <Form.Group controlId="formDataSaida">
                  <Form.Label>Data Saída *</Form.Label>
                  <Form.Control type="date" onChange={handleDataSaida} value={dataSaida} />
                </Form.Group>
              </Col>
              <Col sm={2}>
                <Form.Group controlId="formDiarias">
                  <Form.Label>Diárias</Form.Label>
                  <Form.Control type="number" value={diarias} disabled />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formValorTotal">
                  <Form.Label>Valor Total</Form.Label>
                  <Form.Control type="text" value={`R$ ${valorTotal.toFixed(2)}`} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col sm={12}>
                <Form.Group controlId="formObservacoes">
                  <Form.Label>Observações</Form.Label>
                  <Form.Control as="textarea" rows={3} onChange={handleObservacoes} value={observacoes} />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 gap-2 d-flex">
                <Button variant="success" onClick={salvarHospedagem}>
                Salvar Hospedagem
                </Button>
                
                {/* Botão que ABRE o modal de checkout */}
                <Button variant="danger" onClick={() => setShowCheckout(true)}>
                Fazer Checkout
                </Button>
            </div>

            <hr className="mt-5" />
            <HospedagensLista 
              data={hospedagens} 
              hospedes={hospedes}
              quartos={quartos}
              // Supondo que você tenha essas props no componente original
            />

          </Form>
        </Card.Body>
      </Card>

      {/* --- MODAL DE CHECKOUT --- */}
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)} size="lg">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Realizar Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-4">
            <Form.Label><strong>Selecione o Quarto para Checkout</strong></Form.Label>
            <Form.Select onChange={handleQuartoCheckout} value={quartoCheckout}>
                <option value="">Selecione um quarto ocupado...</option>
                {/* Aqui mostramos apenas os quartos que estão ocupados */}
                {quartos.filter(q => q.status === 'ocupado').map((q) => (
                    <option key={q.id_quarto} value={q.id_quarto}>
                        Quarto {q.numero}
                    </option>
                ))}
            </Form.Select>
          </Form.Group>

          {dadosCheckout ? (
              <Card className="p-3 bg-light">
                  <p><strong>Hóspede:</strong> {dadosCheckout.nomeHospede}</p>
                  <p><strong>Valor da Hospedagem:</strong> R$ {dadosCheckout.valorQuarto.toFixed(2)}</p>
                  <p><strong>Gastos com Alimentação/Serviços:</strong> R$ {dadosCheckout.valorAlimentacao.toFixed(2)}</p>
                  <hr />
                  <h4 className="text-danger"><strong>TOTAL A PAGAR: R$ {dadosCheckout.valorFinal.toFixed(2)}</strong></h4>
              </Card>
          ) : quartoCheckout ? (
              <p className="text-muted">Não há hospedagem ativa ou não foi possível calcular para este quarto.</p>
          ) : null}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckout(false)}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={finalizarCheckout}
            disabled={!dadosCheckout} // Desabilita se não tiver dados
          >
            Checkout Feito (Liberar Quarto)
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Hospedagens;
import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Home() {
  const [quartos, setQuartos] = useState([]);
  const [hospedagens, setHospedagens] = useState([]);
  const [alimentacao, setAlimentacao] = useState([]);
  const [limpeza, setLimpeza] = useState([]);
  const [manutencao, setManutencao] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quartosRes, hospedagensRes, alimentacaoRes, limpezaRes, manutencaoRes] = await Promise.all([
          fetch(`${API_URL}/quartos`),
          fetch(`${API_URL}/hospedagens`),
          fetch(`${API_URL}/alimentacao`),
          fetch(`${API_URL}/limpeza`),
          fetch(`${API_URL}/manutencao`)
        ]);

        setQuartos(await quartosRes.json());
        setHospedagens(await hospedagensRes.json());
        setAlimentacao(await alimentacaoRes.json());
        setLimpeza(await limpezaRes.json());
        setManutencao(await manutencaoRes.json());
      } catch (err) {
        console.log('Erro ao carregar dashboard:', err);
      }
    };
    fetchData();
  }, []);

  const totalQuartos = quartos.length;
  const quartosOcupados = quartos.filter(q => q.status === 'ocupado').length;
  const quartosDisponiveis = quartos.filter(q => (q.status || 'disponível') === 'disponível').length;
  const quartosManutencao = quartos.filter(q => (q.status || 'manutenção') === 'manutenção').length;

  const receitaTotal = hospedagens.reduce((acc, h) => acc + (parseFloat(h.valorTotal) || 0), 0);

  const cozinhaAbertos = alimentacao.filter(a => (a.status || 'aberto') === 'aberto').length;
  const limpezaAbertos = limpeza.filter(l => (l.status || 'aberto') === 'aberto').length;
  const manutencaoAbertos = manutencao.filter(m => (m.status || 'aberto') === 'aberto').length;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const cardStyle = (bg) => ({
    backgroundColor: bg,
    color: '#fff',
    borderRadius: '0.75rem',
    border: 'none',
    minHeight: '140px'
  });

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>

      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card style={cardStyle('#198754')} className="p-3 h-100">
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Quartos Ocupados</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{quartosOcupados} / {totalQuartos}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{quartosDisponiveis} disponíveis</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{quartosManutencao} em manutenção</div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card style={cardStyle('#0d6efd')} className="p-3 h-100">
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Receita Total</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{formatarMoeda(receitaTotal)}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{hospedagens.length} hospedagens</div>
          </Card>
        </Col>

        <Col sm={6} lg={2}>
          <Card style={cardStyle('#dc3545')} className="p-3 h-100">
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Cozinha</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{cozinhaAbertos}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>pedidos abertos</div>
          </Card>
        </Col>

        <Col sm={6} lg={2}>
          <Card style={cardStyle('#6f42c1')} className="p-3 h-100">
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Limpeza</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{limpezaAbertos}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>pedidos abertos</div>
          </Card>
        </Col>

        <Col sm={6} lg={2}>
          <Card style={cardStyle('#fd7e14')} className="p-3 h-100">
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Manutenção</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{manutencaoAbertos}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>pedidos abertos</div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Home;
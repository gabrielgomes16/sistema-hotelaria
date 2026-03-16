import { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './DatePicker.css';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function DatePicker({ label, value, onChange, minDate, maxDate, controlId }) {
  const [aberto, setAberto] = useState(false);
  const [mesAtual, setMesAtual] = useState(() => {
    if (value) {
      const [ano, mes] = value.split('-').map(Number);
      return new Date(ano, mes - 1, 1);
    }
    return new Date();
  });
  const [selecionandoMes, setSelecionandoMes] = useState(false);
  const [selecionandoAno, setSelecionandoAno] = useState(false);
  const containerRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAberto(false);
        setSelecionandoMes(false);
        setSelecionandoAno(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Sincroniza mês visível quando o value muda externamente
  useEffect(() => {
    if (value) {
      const [ano, mes] = value.split('-').map(Number);
      setMesAtual(new Date(ano, mes - 1, 1));
    }
  }, [value]);

  const formatarExibicao = (dataStr) => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const getDiasDoMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();
  const getPrimeiroDiaSemana = (ano, mes) => new Date(ano, mes, 1).getDay();

  const mesAnterior = () => {
    setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const mesSeguinte = () => {
    setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selecionarDia = (dia) => {
    const ano = mesAtual.getFullYear();
    const mes = String(mesAtual.getMonth() + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${diaStr}`;
    onChange(dataFormatada);
    setAberto(false);
  };

  const selecionarMes = (indiceMes) => {
    setMesAtual(new Date(mesAtual.getFullYear(), indiceMes, 1));
    setSelecionandoMes(false);
  };

  const selecionarAno = (ano) => {
    setMesAtual(new Date(ano, mesAtual.getMonth(), 1));
    setSelecionandoAno(false);
  };

  const irParaHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    onChange(`${ano}-${mes}-${dia}`);
    setMesAtual(new Date(ano, hoje.getMonth(), 1));
    setAberto(false);
  };

  const isDiaDesabilitado = (dia) => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const data = new Date(ano, mes, dia);
    if (minDate && data < new Date(minDate)) return true;
    if (maxDate && data > new Date(maxDate)) return true;
    return false;
  };

  const isDiaSelecionado = (dia) => {
    if (!value) return false;
    const [ano, mes, diaVal] = value.split('-').map(Number);
    return ano === mesAtual.getFullYear() && (mes - 1) === mesAtual.getMonth() && diaVal === dia;
  };

  const isHoje = (dia) => {
    const hoje = new Date();
    return hoje.getDate() === dia &&
      hoje.getMonth() === mesAtual.getMonth() &&
      hoje.getFullYear() === mesAtual.getFullYear();
  };

  const renderCalendario = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const totalDias = getDiasDoMes(ano, mes);
    const primeiroDia = getPrimeiroDiaSemana(ano, mes);

    // Dias do mês anterior para preencher início
    const diasMesAnterior = getDiasDoMes(ano, mes - 1);
    const celulas = [];

    // Células vazias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
      celulas.push(
        <div key={`prev-${i}`} className="dp-dia dp-dia-fora">
          {diasMesAnterior - i}
        </div>
      );
    }

    // Dias do mês atual
    for (let dia = 1; dia <= totalDias; dia++) {
      const desabilitado = isDiaDesabilitado(dia);
      const selecionado = isDiaSelecionado(dia);
      const hoje = isHoje(dia);

      let classes = 'dp-dia';
      if (selecionado) classes += ' dp-dia-selecionado';
      if (hoje && !selecionado) classes += ' dp-dia-hoje';
      if (desabilitado) classes += ' dp-dia-desabilitado';

      celulas.push(
        <div
          key={`dia-${dia}`}
          className={classes}
          onClick={desabilitado ? undefined : () => selecionarDia(dia)}
        >
          {dia}
        </div>
      );
    }

    // Dias do próximo mês para preencher final
    const celulasFaltando = 42 - celulas.length;
    for (let i = 1; i <= celulasFaltando; i++) {
      celulas.push(
        <div key={`next-${i}`} className="dp-dia dp-dia-fora">
          {i}
        </div>
      );
    }

    return celulas;
  };

  const renderSeletorMes = () => (
    <div className="dp-seletor-grid">
      {MESES.map((nome, i) => (
        <div
          key={i}
          className={`dp-seletor-item${i === mesAtual.getMonth() ? ' dp-seletor-ativo' : ''}`}
          onClick={() => selecionarMes(i)}
        >
          {nome.substring(0, 3)}
        </div>
      ))}
    </div>
  );

  const renderSeletorAno = () => {
    const anoAtual = mesAtual.getFullYear();
    const anos = [];
    for (let a = anoAtual - 5; a <= anoAtual + 6; a++) {
      anos.push(a);
    }
    return (
      <div className="dp-seletor-grid">
        {anos.map((a) => (
          <div
            key={a}
            className={`dp-seletor-item${a === anoAtual ? ' dp-seletor-ativo' : ''}`}
            onClick={() => selecionarAno(a)}
          >
            {a}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Form.Group controlId={controlId} ref={containerRef} className="dp-container">
      {label && <Form.Label>{label}</Form.Label>}
      <div className="dp-input-wrapper" onClick={() => setAberto(!aberto)}>
        <Form.Control
          type="text"
          readOnly
          value={formatarExibicao(value)}
          placeholder="dd/mm/aaaa"
          className="dp-input"
        />
        <span className="dp-icone">📅</span>
      </div>

      {aberto && (
        <div className="dp-dropdown">
          {/* Header com navegação */}
          <div className="dp-header">
            <button type="button" className="dp-nav-btn" onClick={mesAnterior}>◀</button>
            <div className="dp-header-labels">
              <span
                className="dp-header-mes"
                onClick={() => { setSelecionandoMes(!selecionandoMes); setSelecionandoAno(false); }}
              >
                {MESES[mesAtual.getMonth()]}
              </span>
              <span
                className="dp-header-ano"
                onClick={() => { setSelecionandoAno(!selecionandoAno); setSelecionandoMes(false); }}
              >
                {mesAtual.getFullYear()}
              </span>
            </div>
            <button type="button" className="dp-nav-btn" onClick={mesSeguinte}>▶</button>
          </div>

          {/* Corpo: calendário ou seletores */}
          {selecionandoMes ? (
            renderSeletorMes()
          ) : selecionandoAno ? (
            renderSeletorAno()
          ) : (
            <>
              <div className="dp-dias-semana">
                {DIAS_SEMANA.map((d) => (
                  <div key={d} className="dp-dia-semana">{d}</div>
                ))}
              </div>
              <div className="dp-grid">
                {renderCalendario()}
              </div>
            </>
          )}

          {/* Botão Hoje */}
          <div className="dp-footer">
            <button type="button" className="dp-btn-hoje" onClick={irParaHoje}>
              Hoje
            </button>
          </div>
        </div>
      )}
    </Form.Group>
  );
}

export default DatePicker;

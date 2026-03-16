import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import FiltroLista from '../utils/FiltroLista';

const camposFiltro = [
  { valor: 'tipo', label: 'Tipo' },
  { valor: 'quarto', label: 'Quarto' },
  { valor: 'status', label: 'Status' },
];

export default function LimpezaLista(props) {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCampo, setFiltroCampo] = useState('todos');

  const getNumeroQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.numero : 'N/A';
  };

  const getTipoQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.tipo : 'N/A';
  };

  const handleFiltrar = (texto, campo) => {
    setFiltroTexto(texto);
    setFiltroCampo(campo);
  };

  const dadosFiltrados = props.data.filter((limpeza) => {
    if (!filtroTexto) return true;
    const texto = filtroTexto.toLowerCase();
    const numeroQuarto = String(getNumeroQuarto(limpeza.id_quarto)).toLowerCase();
    const statusTexto = limpeza.status === 'finalizado' ? 'finalizado' : 'aberto';
    if (filtroCampo === 'tipo') return limpeza.tipo?.toLowerCase().includes(texto);
    if (filtroCampo === 'quarto') return numeroQuarto.includes(texto);
    if (filtroCampo === 'status') return statusTexto.includes(texto);
    return (
      limpeza.tipo?.toLowerCase().includes(texto) ||
      numeroQuarto.includes(texto) ||
      statusTexto.includes(texto)
    );
  });

  return (
    <>
      <FiltroLista campos={camposFiltro} onFiltrar={handleFiltrar} />
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Tipo</th>
            <th scope="col">Quarto</th>
            <th scope="col">Status</th>
            <th scope="col">Ação</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((limpeza) => (
            <tr key={limpeza.id_limpeza}>
              <td> 
                <input
                  type="radio"
                  name="rdLimpeza"
                  onChange={(e) => props.handleSelecao(limpeza.id_limpeza)}                                            
                />
              </td>
              <td> {limpeza.id_limpeza}</td>
              <td> {limpeza.tipo} </td>
              <td> {getNumeroQuarto(limpeza.id_quarto)} ({getTipoQuarto(limpeza.id_quarto)})</td>
              <td>
                <span className={`badge ${limpeza.status === 'finalizado' ? 'bg-secondary' : 'bg-success'}`}>
                  {limpeza.status === 'finalizado' ? 'Finalizado' : 'Aberto'}
                </span>
              </td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => props.deletarPedido(limpeza.id_limpeza)}
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

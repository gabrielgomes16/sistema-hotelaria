import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import FiltroLista from '../utils/FiltroLista';

const camposFiltro = [
  { valor: 'problema', label: 'Problema' },
  { valor: 'quarto', label: 'Quarto' },
  { valor: 'status', label: 'Status' },
];

export default function ManutencaoLista(props) {
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

  const dadosFiltrados = props.data.filter((manutencao) => {
    if (!filtroTexto) return true;
    const texto = filtroTexto.toLowerCase();
    const numeroQuarto = String(getNumeroQuarto(manutencao.id_quarto)).toLowerCase();
    const statusTexto = manutencao.status === 'finalizado' ? 'finalizado' : 'aberto';
    if (filtroCampo === 'problema') return manutencao.problema?.toLowerCase().includes(texto);
    if (filtroCampo === 'quarto') return numeroQuarto.includes(texto);
    if (filtroCampo === 'status') return statusTexto.includes(texto);
    return (
      manutencao.problema?.toLowerCase().includes(texto) ||
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
            <th scope="col">Problema</th>
            <th scope="col">Quarto</th>
            <th scope="col">Status</th>
            <th scope="col">Ação</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((manutencao) => (
            <tr key={manutencao.id_manutencao}>
              <td> 
                <input
                  type="radio"
                  name="rdManutencao"
                  onChange={(e) => props.handleSelecao(manutencao.id_manutencao)}                                            
                />
              </td>
              <td> {manutencao.id_manutencao}</td>
              <td> {manutencao.problema} </td>
              <td> {getNumeroQuarto(manutencao.id_quarto)} ({getTipoQuarto(manutencao.id_quarto)})</td>
              <td>
                <span className={`badge ${manutencao.status === 'finalizado' ? 'bg-secondary' : 'bg-success'}`}>
                  {manutencao.status === 'finalizado' ? 'Finalizado' : 'Aberto'}
                </span>
              </td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => props.deletarPedido(manutencao.id_manutencao)}
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

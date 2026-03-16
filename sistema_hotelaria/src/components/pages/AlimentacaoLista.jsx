import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import FiltroLista from '../utils/FiltroLista';
import { formatarMoeda } from '../utils/Utils';

const camposFiltro = [
  { valor: 'prato', label: 'Prato' },
  { valor: 'quarto', label: 'Quarto' },
  { valor: 'status', label: 'Status' },
];

export default function AlimentacaoLista(props) {
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

  const calcularTotal = (preco, quantidade) => {
    const precoN = parseFloat(preco);
    const quantidadeN = parseInt(quantidade, 10);
    if (isNaN(precoN) || isNaN(quantidadeN)) return 0;
    return precoN * quantidadeN;
  };

  const handleFiltrar = (texto, campo) => {
    setFiltroTexto(texto);
    setFiltroCampo(campo);
  };

  const dadosFiltrados = props.data.filter((alimentacao) => {
    if (!filtroTexto) return true;
    const texto = filtroTexto.toLowerCase();
    const numeroQuarto = String(getNumeroQuarto(alimentacao.id_quarto)).toLowerCase();
    const statusTexto = alimentacao.status === 'finalizado' ? 'finalizado' : 'aberto';
    if (filtroCampo === 'prato') return alimentacao.prato?.toLowerCase().includes(texto);
    if (filtroCampo === 'quarto') return numeroQuarto.includes(texto);
    if (filtroCampo === 'status') return statusTexto.includes(texto);
    return (
      alimentacao.prato?.toLowerCase().includes(texto) ||
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
            <th scope="col">Prato</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Valor Total</th>
            <th scope="col">Quarto</th>
            <th scope="col">Status</th>
            <th scope="col">Ação</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((alimentacao) => (
            <tr key={alimentacao.id_alimentacao}>
              <td> 
                <input
                  type="radio"
                  name="rdAlimentacao"
                  onChange={(e) => props.handleSelecao(alimentacao.id_alimentacao)}                                            
                />
              </td>
              <td> {alimentacao.id_alimentacao}</td>
              <td> {alimentacao.prato} </td>
              <td> {alimentacao.quantidade} </td>
              <td> {formatarMoeda(calcularTotal(alimentacao.preco, alimentacao.quantidade))}  </td>
              <td> {getNumeroQuarto(alimentacao.id_quarto)} ({getTipoQuarto(alimentacao.id_quarto)})</td>
              <td>
                <span className={`badge ${alimentacao.status === 'finalizado' ? 'bg-secondary' : 'bg-success'}`}>
                  {alimentacao.status === 'finalizado' ? 'Finalizado' : 'Aberto'}
                </span>
              </td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => props.deletarPedido(alimentacao.id_alimentacao)}
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

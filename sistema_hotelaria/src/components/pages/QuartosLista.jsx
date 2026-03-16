import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import FiltroLista from '../utils/FiltroLista';
import { formatarMoeda } from '../utils/Utils';

const camposFiltro = [
  { valor: 'numero', label: 'Número' },
  { valor: 'tipo', label: 'Tipo' },
  { valor: 'status', label: 'Status' },
];

export default function QuartosLista(props) {
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroCampo, setFiltroCampo] = useState('todos');

    const formatStatus = (status) => {
      if (!status) return 'disponível';
      return status;
    };

    const handleFiltrar = (texto, campo) => {
      setFiltroTexto(texto);
      setFiltroCampo(campo);
    };

    const dadosFiltrados = props.data.filter((quarto) => {
      if (!filtroTexto) return true;
      const texto = filtroTexto.toLowerCase();
      if (filtroCampo === 'numero') return String(quarto.numero).toLowerCase().includes(texto);
      if (filtroCampo === 'tipo') return quarto.tipo?.toLowerCase().includes(texto);
      if (filtroCampo === 'status') return formatStatus(quarto.status).toLowerCase().includes(texto);
      return (
        String(quarto.numero).toLowerCase().includes(texto) ||
        quarto.tipo?.toLowerCase().includes(texto) ||
        formatStatus(quarto.status).toLowerCase().includes(texto)
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
                <th scope="col">Número</th>
                <th scope="col">Tipo</th>
                <th scope="col">Preço</th>
                <th scope="col">Status</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((quarto) => (
                <tr key={quarto.id_quarto}>
                  <td> 
                    <input
                        type="radio"
                        name="rdQuarto"
                        onChange={(e) => props.handleSelecao(quarto.id_quarto)}                                            
                    />
                  </td>
                  <td> {quarto.id_quarto}</td>                  
                  <td> {quarto.numero}</td>
                  <td> {quarto.tipo}</td>
                  <td> {formatarMoeda(quarto.preco)}</td>
                  <td> {formatStatus(quarto.status)}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => props.deletarQuarto(quarto.id_quarto)}
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

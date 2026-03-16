import React from 'react'
import Button from 'react-bootstrap/Button';

export default function LimpezaLista(props) {

  const getNumeroQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.numero : 'N/A';
  };

  const getTipoQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.tipo : 'N/A';
  };

  return (
    <>
      <br></br>
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
          {props.data.map((limpeza) => (
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

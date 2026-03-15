import React from 'react'
import Button from 'react-bootstrap/Button';

export default function ManutencaoLista(props) {

  const getNumeroQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.numero : 'N/A';
  };

  const getTipoQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.tipo : 'N/A';
  };

  const formatarMoeda = (valor) => {
    const numero = parseFloat(valor);
    
      if (isNaN(numero)) return 'R$ 0,00'; 

      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numero);
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
            <th scope="col">Valor Total</th>
            <th scope="col">Quarto</th>
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
              <td> {formatarMoeda(limpeza.preco)}  </td>
              <td> {getNumeroQuarto(limpeza.id_quarto)} ({getTipoQuarto(limpeza.id_quarto)})</td>

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

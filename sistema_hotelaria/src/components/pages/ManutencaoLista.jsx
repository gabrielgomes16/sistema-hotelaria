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
            <th scope="col">Problema</th>
            <th scope="col">Valor Total</th>
            <th scope="col">Quarto</th>
            <th scope="col">Ação</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((manutencao) => (
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
              <td> {formatarMoeda(manutencao.preco)}  </td>
              <td> {getNumeroQuarto(manutencao.id_quarto)} ({getTipoQuarto(manutencao.id_quarto)})</td>

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

import React from 'react'
import Button from 'react-bootstrap/Button';

export default function HospedagensLista(props) {

  const getNomeHospede = (id) => {
    const hospede = props.hospedes.find(h => h.id_hospede === id);
    return hospede ? hospede.nome : 'N/A';
  };

  const getNumeroQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.numero : 'N/A';
  };

  const getTipoQuarto = (id) => {
    const quarto = props.quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.tipo : 'N/A';
  };

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <br></br>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Hóspede</th>
            <th scope="col">Quarto</th>
            <th scope="col">Entrada</th>
            <th scope="col">Saída</th>
            <th scope="col">Diárias</th>
            <th scope="col">Valor Total</th>
            <th scope="col">Ação</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((hospedagem) => (
            <tr key={hospedagem.id_hospedagem}>
              <td> 
                <input
                  type="radio"
                  name="rdHospedagem"
                  onChange={(e) => props.handleSelecao(hospedagem.id_hospedagem)}                                            
                />
              </td>
              <td> {hospedagem.id_hospedagem}</td>                  
              <td> {getNomeHospede(hospedagem.id_hospede)}</td>
              <td> {getNumeroQuarto(hospedagem.id_quarto)} ({getTipoQuarto(hospedagem.id_quarto)})</td>
              <td> {formatarData(hospedagem.dataEntrada)}</td>
              <td> {formatarData(hospedagem.dataSaida)}</td>
              <td> {hospedagem.diarias}</td>
              <td> R$ {parseFloat(hospedagem.valorTotal).toFixed(2)}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => props.deletarHospedagem(hospedagem.id_hospedagem)}
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

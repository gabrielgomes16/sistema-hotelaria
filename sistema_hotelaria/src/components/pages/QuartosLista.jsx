import React from 'react'
import Button from 'react-bootstrap/Button';

export default function QuartosLista(props) {
    const formatStatus = (status) => {
      if (!status) {
        return 'disponível';
      }

      return status;
    };

    return (
        <>
          <table className="table">
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
              {props.data.map((quarto) => (
                <tr key={quarto.id_quarto}>
                  <td> 
                    <input
                        type="radio"
                        name="rdQuarto"
                        onChange={(e) =>props.handleSelecao(quarto.id_quarto)}                                            
                    />
                  </td>
                  <td> {quarto.id_quarto}</td>                  
                  <td> {quarto.numero}</td>
                  <td> {quarto.tipo}</td>
                  <td> R$ {parseFloat(quarto.preco).toFixed(2)}</td>
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

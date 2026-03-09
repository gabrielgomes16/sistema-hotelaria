import React from 'react'

export default function HospedesLista(props) {
    return (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">id</th>
                <th scope="col">Nome</th>
              </tr>
            </thead>
            <tbody>
              {props.data.map((hospede) => (
                <tr key={hospede.id_hospede}>
                  <td> 
                    <input
                        type="radio"
                        name="rdAxial"
                        onChange={(e) =>props.handleSelecao(hospede.id_hospede)}                                            
                    />
                  </td>
                  <td> {hospede.id_hospede}</td>                  
                  <td> {hospede.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
}
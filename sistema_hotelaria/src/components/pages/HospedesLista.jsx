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
                <th scope="col">Email</th>
                <th scope="col">CPF</th>
                <th scope="col">Telefone</th>
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
                  <td> {hospede.email}</td>
                  <td> {hospede.cpf}</td>
                  <td> {hospede.telefone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
}
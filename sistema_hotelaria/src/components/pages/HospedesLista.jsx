import React, { useState } from 'react'
import FiltroLista from '../utils/FiltroLista';

const camposFiltro = [
  { valor: 'nome', label: 'Nome' },
  { valor: 'cpf', label: 'CPF' },
  { valor: 'email', label: 'Email' },
];

export default function HospedesLista(props) {
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroCampo, setFiltroCampo] = useState('todos');

    const handleFiltrar = (texto, campo) => {
      setFiltroTexto(texto);
      setFiltroCampo(campo);
    };

    const dadosFiltrados = props.data.filter((hospede) => {
      if (!filtroTexto) return true;
      const texto = filtroTexto.toLowerCase();
      if (filtroCampo === 'nome') return hospede.nome?.toLowerCase().includes(texto);
      if (filtroCampo === 'cpf') return hospede.cpf?.toLowerCase().includes(texto);
      if (filtroCampo === 'email') return hospede.email?.toLowerCase().includes(texto);
      return (
        hospede.nome?.toLowerCase().includes(texto) ||
        hospede.cpf?.toLowerCase().includes(texto) ||
        hospede.email?.toLowerCase().includes(texto)
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
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">CPF</th>
                <th scope="col">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((hospede) => (
                <tr key={hospede.id_hospede}>
                  <td> 
                    <input
                        type="radio"
                        name="rdHospede"
                        onChange={(e) => props.handleSelecao(hospede.id_hospede)}                                            
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
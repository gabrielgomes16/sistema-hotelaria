import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function FiltroLista({ campos, onFiltrar }) {
  const [texto, setTexto] = useState('');
  const [campoSelecionado, setCampoSelecionado] = useState('todos');

  const handleTextoChange = (e) => {
    const novoTexto = e.target.value;
    setTexto(novoTexto);
    onFiltrar(novoTexto, campoSelecionado);
  };

  const handleCampoChange = (e) => {
    const novoCampo = e.target.value;
    setCampoSelecionado(novoCampo);
    onFiltrar(texto, novoCampo);
  };

  return (
    <InputGroup className="mb-3">
      <Form.Select
        style={{ maxWidth: '200px' }}
        value={campoSelecionado}
        onChange={handleCampoChange}
      >
        <option value="todos">Todos os campos</option>
        {campos.map((campo) => (
          <option key={campo.valor} value={campo.valor}>
            {campo.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={texto}
        onChange={handleTextoChange}
      />
    </InputGroup>
  );
}

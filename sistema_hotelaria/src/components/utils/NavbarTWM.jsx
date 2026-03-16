import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarTWM() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <NavDropdown title="Cadastros" id="nav-dropdown-cadastros">
              <NavDropdown.Item as={Link} to="/hospedes">Hóspedes</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/quartos">Quartos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/hospedagens">Hospedagens</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Serviços" id="nav-dropdown-servicos">
              <NavDropdown.Item as={Link} to="/alimentacao">Cozinha</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/manutencao">Manutenção</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/limpeza">Limpeza</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default NavbarTWM;

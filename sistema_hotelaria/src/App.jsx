import './App.css'
/* Adicionando os componentes/paginas */
import Home from './components/pages/Home';
import Contato from './components/pages/Contato';
import Hospedes from './components/pages/Hospedes';
import Quartos from './components/pages/Quartos';
import Hospedagens from './components/pages/Hospedagens';
import Alimentacao from './components/pages/Alimentacao';
import NavbarTWM from './components/utils/NavbarTWM';
/* Adicionando os componentes de navegacao do React */
import { BrowserRouter as Router, 
         Routes, Route, Link } from "react-router-dom";

{
  /* The following line can be included in your src/index.js or App.js file */
}
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
        <Router>
          <NavbarTWM />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/hospedes" element={<Hospedes />} />
            <Route path="/quartos" element={<Quartos />} />
            <Route path="/hospedagens" element={<Hospedagens />} />
             <Route path="/alimentacao" element={<Alimentacao />} />
          </Routes>
        </Router>
    </>
  )
}

export default App

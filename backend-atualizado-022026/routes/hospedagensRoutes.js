const express = require('express');
const router = express.Router();
const hospedagemControler = require('../controllers/hospedagemController');

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL',
    version: '1.0.0',
  });
});

router.post('/', hospedagemControler.criar);
router.put('/:id', hospedagemControler.atualizar);
router.get('/', hospedagemControler.listar);
router.get('/:id', hospedagemControler.buscarPorId);
router.delete('/:id', hospedagemControler.remover);

module.exports = router;

const express = require('express');
const router = express.Router();
const hospedeControler = require('../controllers/hospedeController');

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL',
    version: '1.0.0',
  });
});

router.post('/', hospedeControler.criar);
router.put('/:id', hospedeControler.atualizar);
router.get('/', hospedeControler.listar);
router.get('/:id', hospedeControler.buscarPorId);
router.delete('/:id', hospedeControler.remover);
module.exports = router;
const express = require('express');
const router = express.Router();
const alimentacaoControler = require('../controllers/alimentacaoController');

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL',
    version: '1.0.0',
  });
});

router.post('/', alimentacaoControler.criar);
router.get('/', alimentacaoControler.listar);
router.get('/:id', alimentacaoControler.buscarPorId);
router.delete('/:id', alimentacaoControler.remover);

module.exports = router;

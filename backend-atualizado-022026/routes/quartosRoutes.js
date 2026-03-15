const express = require('express');
const router = express.Router();
const quartoControler = require('../controllers/quartoController');

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL',
    version: '1.0.0',
  });
});

router.post('/', quartoControler.criar);
router.get('/', quartoControler.listar);
router.get('/:id', quartoControler.buscarPorId);
router.patch('/:id/status', quartoControler.atualizarStatus);
router.delete('/:id', quartoControler.remover);

module.exports = router;

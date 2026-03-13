const express = require('express');
const router = express.Router();
const limpezaControler = require('../controllers/limpezaController');

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL',
    version: '1.0.0',
  });
});

router.post('/', limpezaControler.criar);
router.get('/', limpezaControler.listar);
router.get('/:id', limpezaControler.buscarPorId);
router.delete('/:id', limpezaControler.remover);

module.exports = router;

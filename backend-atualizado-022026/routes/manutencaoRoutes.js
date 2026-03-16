const express = require('express');
const router = express.Router();
const manutencaoControler = require('../controllers/manutencaoController');

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL',
    version: '1.0.0',
  });
});

router.post('/', manutencaoControler.criar);
router.put('/:id', manutencaoControler.atualizar);
router.get('/', manutencaoControler.listar);
router.get('/:id', manutencaoControler.buscarPorId);
router.delete('/:id', manutencaoControler.remover);

module.exports = router;

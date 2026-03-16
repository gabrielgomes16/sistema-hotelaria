const express = require('express');
const router = express.Router();
const cardapioController = require('../controllers/cardapioController');

router.post('/', cardapioController.criar);
router.get('/', cardapioController.listar);
router.get('/:id', cardapioController.buscarPorId);
router.put('/:id', cardapioController.atualizar);
router.delete('/:id', cardapioController.remover);

module.exports = router;

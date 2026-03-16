const Cardapio = require('../models/Cardapio');

exports.criar = async (req, res) => {
  try {
    const novo = await Cardapio.create(req.body);
    res.json(novo);
  } catch (error) {
    console.error('Erro ao criar prato:', error);
    res.status(500).json({ error: 'Erro ao salvar prato no cardápio.' });
  }
};

exports.listar = async (req, res) => {
  try {
    const itens = await Cardapio.findAll({ order: [['nome', 'ASC']] });
    res.json(itens);
  } catch (error) {
    console.error('Erro ao listar cardápio:', error);
    res.status(500).json({ error: 'Erro ao listar cardápio.' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const item = await Cardapio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Prato não encontrado.' });
    res.json(item);
  } catch (error) {
    console.error('Erro ao buscar prato:', error);
    res.status(500).json({ error: 'Erro ao buscar prato.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const item = await Cardapio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Prato não encontrado.' });
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error('Erro ao atualizar prato:', error);
    res.status(500).json({ error: 'Erro ao atualizar prato.' });
  }
};

exports.remover = async (req, res) => {
  try {
    await Cardapio.destroy({ where: { id_cardapio: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover prato:', error);
    res.status(500).json({ error: 'Erro ao remover prato.' });
  }
};

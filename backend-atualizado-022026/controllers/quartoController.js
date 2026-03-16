const Quarto = require('../models/Quarto');

const STATUS_QUARTO = ['disponível', 'ocupado', 'manutenção'];

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.status) {
      payload.status = 'disponível';
    }

    if (!STATUS_QUARTO.includes(payload.status)) {
      return res.status(400).json({ error: 'Status de quarto inválido.' });
    }

    const novo = await Quarto.create(payload);
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar quarto.' });
  }
};

exports.listar = async (req, res) => {
  const quartos = await Quarto.findAll();
  res.json(quartos);
};

exports.buscarPorId = async (req, res) => {
  const quarto = await Quarto.findByPk(req.params.id);
  res.json(quarto);
};

exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!STATUS_QUARTO.includes(status)) {
      return res.status(400).json({ error: 'Status de quarto inválido.' });
    }

    const quarto = await Quarto.findByPk(req.params.id);

    if (!quarto) {
      return res.status(404).json({ error: 'Quarto não encontrado.' });
    }

    await quarto.update({ status });
    return res.json(quarto);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar status do quarto.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const quarto = await Quarto.findByPk(req.params.id);

    if (!quarto) {
      return res.status(404).json({ error: 'Quarto não encontrado.' });
    }

    const payload = { ...req.body };
    if (payload.status && !STATUS_QUARTO.includes(payload.status)) {
      return res.status(400).json({ error: 'Status de quarto inválido.' });
    }

    await quarto.update(payload);
    return res.json(quarto);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar quarto.' });
  }
};

exports.remover = async (req, res) => {
  res.status(204).send();
};

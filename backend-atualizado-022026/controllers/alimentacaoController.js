const Alimentacao = require('../models/Alimentacao');

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  const novo = await Alimentacao.create(req.body);
  res.json(novo);
};

exports.listar = async (req, res) => {
  const alimentacoes = await Alimentacao.findAll();
  res.json(alimentacoes);
};

exports.buscarPorId = async (req, res) => {
  const alimentacao = await Alimentacao.findByPk(req.params.id);
  res.json(alimentacao);
};

exports.atualizar = async (req, res) => {
  const alimentacao = await Alimentacao.findByPk(req.params.id);
  if (!alimentacao) {
    return res.status(404).json({ error: 'Registro de alimentação não encontrado.' });
  }
  await alimentacao.update(req.body);
  res.json(alimentacao);
};

exports.remover = async (req, res) => {
  await Alimentacao.destroy({ where: { id_alimentacao: req.params.id } });
  res.status(204).send();
};

const Manutencao = require('../models/Manutencao');

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  const novo = await Manutencao.create(req.body);
  res.json(novo);
};

exports.listar = async (req, res) => {
  const manutencoes = await Manutencao.findAll();
  res.json(manutencoes);
};

exports.buscarPorId = async (req, res) => {
  const manutencao = await Manutencao.findByPk(req.params.id);
  res.json(manutencao);
};

exports.remover = async (req, res) => {
  await Manutencao.destroy({ where: { id_manutencao: req.params.id } });
  res.status(204).send();
};

const Limpeza = require('../models/Limpeza');

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  const novo = await Limpeza.create(req.body);
  res.json(novo);
};

exports.listar = async (req, res) => {
  const limpezas = await Limpeza.findAll();
  res.json(limpezas);
};

exports.buscarPorId = async (req, res) => {
  const limpeza = await Limpeza.findByPk(req.params.id);
  res.json(limpeza);
};

exports.remover = async (req, res) => {
  await Limpeza.destroy({ where: { id_limpeza: req.params.id } });
  res.status(204).send();
};

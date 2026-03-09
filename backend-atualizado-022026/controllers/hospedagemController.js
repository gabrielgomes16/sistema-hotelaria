const Hospedagem = require('../models/Hospedagem');

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  const novo = await Hospedagem.create(req.body);
  res.json(novo);
};

exports.listar = async (req, res) => {
  const hospedagens = await Hospedagem.findAll();
  res.json(hospedagens);
};

exports.buscarPorId = async (req, res) => {
  const hospedagem = await Hospedagem.findByPk(req.params.id);
  res.json(hospedagem);
};

exports.remover = async (req, res) => {
  await Hospedagem.destroy({ where: { id_hospedagem: req.params.id } });
  res.status(204).send();
};

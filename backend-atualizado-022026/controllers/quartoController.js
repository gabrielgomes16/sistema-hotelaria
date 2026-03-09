const Quarto = require('../models/Quarto');

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  const novo = await Quarto.create(req.body);
  res.json(novo);
};

exports.listar = async (req, res) => {
  const quartos = await Quarto.findAll();
  res.json(quartos);
};

exports.buscarPorId = async (req, res) => {
  const quarto = await Quarto.findByPk(req.params.id);
  res.json(quarto);
};

exports.remover = async (req, res) => {
  await Quarto.destroy({ where: { id_quarto: req.params.id } });
  res.status(204).send();
};

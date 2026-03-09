const Hospede = require('../models/Hospede');

exports.teste = async (req, res) => {  
  res.json({ message: 'MARAVILHA!!!'});
};

exports.criar = async (req, res) => {
  const novo = await Hospede.create(req.body);
  res.json(novo);
};

exports.listar = async (req, res) => {
  const hospedes = await Hospede.findAll();
  res.json(hospedes);
};

exports.buscarPorId = async (req, res) => {
  const hospede = await Hospede.findByPk(req.params.id);
  res.json(hospede);
};

exports.atualizar = async (req, res) => {
  const hospede = await Hospede.findByPk(req.params.id);
  if (hospede) {
    await hospede.update(req.body);
    res.json(hospede);
  } else {
    res.status(404).json({ message: 'Hospede não encontrado' });
  }
};

exports.remover = async (req, res) => {
  await Hospede.destroy({ where: { id_hospede: req.params.id } });
  res.status(204).send();
};
const Hospedagem = require('../models/Hospedagem');
const Quarto = require('../models/Quarto');
const sequelize = require('../config/database');

exports.teste = async (req, res) => {
  res.json({ message: 'MARAVILHA!!!' });
};

exports.criar = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id_quarto } = req.body;

    const quarto = await Quarto.findByPk(id_quarto, { transaction });

    if (!quarto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Quarto não encontrado.' });
    }

    const statusAtual = quarto.status || 'disponível';

    if (statusAtual !== 'disponível') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Quarto indisponível para hospedagem.' });
    }

    const novo = await Hospedagem.create(req.body, { transaction });
    await quarto.update({ status: 'ocupado' }, { transaction });

    await transaction.commit();
    return res.status(201).json(novo);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Erro ao criar hospedagem.' });
  }
};

exports.listar = async (req, res) => {
  const hospedagens = await Hospedagem.findAll();
  res.json(hospedagens);
};

exports.buscarPorId = async (req, res) => {
  const hospedagem = await Hospedagem.findByPk(req.params.id);
  res.json(hospedagem);
};

exports.atualizar = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const hospedagem = await Hospedagem.findByPk(req.params.id, { transaction });

    if (!hospedagem) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Hospedagem não encontrada.' });
    }

    const { id_quarto } = req.body;

    if (id_quarto && id_quarto !== hospedagem.id_quarto) {
      const quartoAnterior = await Quarto.findByPk(hospedagem.id_quarto, { transaction });
      if (quartoAnterior) {
        await quartoAnterior.update({ status: 'disponível' }, { transaction });
      }

      const novoQuarto = await Quarto.findByPk(id_quarto, { transaction });
      if (!novoQuarto) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Novo quarto não encontrado.' });
      }
      if (novoQuarto.status !== 'disponível') {
        await transaction.rollback();
        return res.status(400).json({ error: 'Novo quarto não está disponível.' });
      }
      await novoQuarto.update({ status: 'ocupado' }, { transaction });
    }

    await hospedagem.update(req.body, { transaction });
    await transaction.commit();
    return res.json(hospedagem);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Erro ao atualizar hospedagem.' });
  }
};

exports.remover = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const hospedagem = await Hospedagem.findByPk(req.params.id, { transaction });

    if (!hospedagem) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Hospedagem não encontrada.' });
    }

    const quarto = await Quarto.findByPk(hospedagem.id_quarto, { transaction });

    if (quarto) {
      await quarto.update({ status: 'disponível' }, { transaction });
    }

    await Hospedagem.destroy({
      where: { id_hospedagem: req.params.id },
      transaction
    });

    await transaction.commit();
    return res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Erro ao remover hospedagem.' });
  }
};

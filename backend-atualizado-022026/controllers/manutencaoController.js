const Manutencao = require('../models/Manutencao');
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
      return res.status(400).json({ error: 'Somente quartos disponíveis podem ir para manutenção.' });
    }

    const novo = await Manutencao.create(req.body, { transaction });
    await quarto.update({ status: 'manutenção' }, { transaction });

    await transaction.commit();
    return res.status(201).json(novo);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Erro ao criar manutenção.' });
  }
};

exports.listar = async (req, res) => {
  const manutencoes = await Manutencao.findAll();
  res.json(manutencoes);
};

exports.buscarPorId = async (req, res) => {
  const manutencao = await Manutencao.findByPk(req.params.id);
  res.json(manutencao);
};

exports.atualizar = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const manutencao = await Manutencao.findByPk(req.params.id, { transaction });

    if (!manutencao) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Manutenção não encontrada.' });
    }

    const { id_quarto } = req.body;

    if (id_quarto && id_quarto !== manutencao.id_quarto) {
      const quartoAnterior = await Quarto.findByPk(manutencao.id_quarto, { transaction });
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
      await novoQuarto.update({ status: 'manutenção' }, { transaction });
    }

    await manutencao.update(req.body, { transaction });
    await transaction.commit();
    return res.json(manutencao);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Erro ao atualizar manutenção.' });
  }
};

exports.remover = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const manutencao = await Manutencao.findByPk(req.params.id, { transaction });

    if (!manutencao) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Manutenção não encontrada.' });
    }

    const quarto = await Quarto.findByPk(manutencao.id_quarto, { transaction });
    if (quarto) {
      await quarto.update({ status: 'disponível' }, { transaction });
    }

    await Manutencao.destroy({
      where: { id_manutencao: req.params.id },
      transaction
    });

    await transaction.commit();
    return res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Erro ao remover manutenção.' });
  }
};

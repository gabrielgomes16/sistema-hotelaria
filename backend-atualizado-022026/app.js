const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./config/database');
const hospedesRoutes = require('./routes/hospedesRoutes');
const quartosRoutes = require('./routes/quartosRoutes');
const hospedagensRoutes = require('./routes/hospedagensRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(express.json());
app.use(cors());
app.use('/hospedes', hospedesRoutes);
app.use('/quartos', quartosRoutes);
app.use('/hospedagens', hospedagensRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});
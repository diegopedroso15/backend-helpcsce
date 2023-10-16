const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const ticketRoutes = require('./routes/ticketRoute');
const mailRoutes = require('./routes/mailRoute');
const commentRoutes = require('./routes/commentRoute');
app.use('/tickets', ticketRoutes);
app.use('/mails', mailRoutes);
app.use('/comments', commentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

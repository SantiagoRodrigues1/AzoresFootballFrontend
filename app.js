// server.js (ou app.js)
const express = require('express');
const cors = require('cors');
const teamsRouter = require('./routes/teams');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const teamsRouter = require('./routes/teams');
app.use('/api', teamsRouter);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend AzoresScore rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
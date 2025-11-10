const app = require('./app');
const {connectionTest, closeConnection} = require('./middleware/dbConnect.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectionTest();
});

process.on('SIGINT', async () =>{
  console.log("Encerrando o servidor");
  await closeConnection();
  console.log("Conexão com banco de dados encerrado");
  process.exit(0);
});

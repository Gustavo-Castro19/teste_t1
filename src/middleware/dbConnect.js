const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    password: process.env.DB_PSW,
    database: process.env.DB_NAME
});

async function connectionTest(){
    try {
        const connection = await db.getConnection();
        console.log('Conexão bem-sucedida!');
        connection.release();
    }catch (err) {
        console.error('Erro ao conectar ao banco:', err.message);
    }
}

async function closeConnection(){
    try{
        await db.end();
    }catch(err){
        throw new Error(`Erro ao fechar conexão: ${err}`);        
    }
}

module.exports = {
    db,
    connectionTest,
    closeConnection
}

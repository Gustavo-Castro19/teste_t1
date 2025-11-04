const mysql = require('mysql2/promise');

const db = mysql.createPool({
    user: 'root',
    host: 'localhost',
    port: 3306,
    password: 'c@tolic@',
    database: 'db_teste'
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
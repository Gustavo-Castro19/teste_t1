const {db} = require('../middleware/dbConnect.js');

async function viewAllProduct(){
    const sql = 'SELECT p.idPro, p.nomePro, p.valuePro, p.quantityPro, p.tagPro, p.atributesPro, p.metaPro FROM product AS p';
    try{
        const [rows] = await db.execute(sql);
        return {rows};
    }catch(err){
        console.log(`Falha ao consultar todo o stock ${err}`);
    }
}

function viewProduct(req){

}

async function newProduct(req){
    const sql = 'INSERT INTO product(nomePro, valuePro, quantityPro, tagPro, atributesPro, metaPro) VALUES (?, ?, ?, ?, ?, ?)';
    try{
        await db.execute(sql, [
            req.nome,
            req.value,
            req.quantity,
            req.tag,
            req.atributes,
            JSON.stringify(req.meta)
        ]);
    }catch(err){
        console.log(`Error ao criar produto: ${err}`);
    }
}

function updateProduct(req){

}

function deleteProduct(req){

}

module.exports = {
    viewAllProduct,
    viewProduct,
    newProduct,
    updateProduct,
    deleteProduct
}
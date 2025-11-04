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


async function viewProduct(req){
    const sql = 'SELECT p.idPro, p.nomePro, p.valuePro, p.quantityPro, p.tagPro, p.atributesPro, p.metaPro FROM product AS p WHERE p.idPro = ?'
    try{
        const [rows] = await db.execute(sql, req);
        return {rows};
    }catch(err){
        console.log(`Falha ao consultar produto ${err}`);
    }
}
async function print(){
    const result = await viewProduct([3]);
    console.log(JSON.stringify(result, null, 2));
}
print();

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
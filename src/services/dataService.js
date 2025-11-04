const {db} = require('../middleware/dbConnect.js');

function viewAllProduct(req){""

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

let item = {nome:'lego', value: 23.12, quantity: 3, tag:'brinquedo', atributes:'', meta:[]}
newProduct(item);

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
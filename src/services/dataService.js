const {db} = require('../middleware/dbConnect.js');

async function viewAllProduct(){
    const sql = 'SELECT p.id, p.nome, p.value, p.quantity, p.image_path, p.tag, p.atributes, p.meta FROM product AS p';
    try{
        const [rows] = await db.execute(sql);
        return rows;
    }catch(err){
        throw new Error(`Falha ao consultar estoque: ${err}`);
    }
}

async function viewProduct(req){
    const sql = 'SELECT p.id, p.nome, p.value, p.quantity, p.image_path, ,p.tag, p.atributes, p.meta FROM product AS p WHERE p.id = ?'
    try{
        const [rows] = await db.execute(sql, [req.id]);
        return rows;
    }catch(err){
        throw new Error(`Falha ao consultar produto: ${err}`);
    }
}

async function newProduct(req){
    const sql = 'INSERT INTO product(nome, value, quantity, image_path, tag, atributes, meta) VALUES (?, ?, ?, ?, ?, ?)';
    try{
        const [result] = await db.execute(sql, [
            req.nome,
            req.value,
            req.quantity,
            req.image_path,
            req.tag,
            req.atributes,
            JSON.stringify(req.meta)
        ]);
        return result;
    }catch(err){
        throw new Error(`Error ao criar produto: ${err}`);
    }
}

async function updateProduct(req){
    let atribute = "";
    let value = [];

    try{
        if(req.id == undefined){
            throw new Error("Require field 'id'.");
        }
        for(let field in req){
            if(field !== "id"){
                if(req[field] !== undefined){
                    if(atribute !== "") atribute += ", ";
                    atribute += `${field} = ?`;
                    value.push(req[field]);
                }
            }
        }
    
        const sql = `UPDATE product SET ${atribute} WHERE id = ?`;

        const [result] = await db.execute(sql, [...value, req.id]);
        return result;
    }catch(err){
        throw new Error(`Erro ao atualizar produto: ${err}`);
    }
}

async function deleteProduct(req){
    const sql = "DELETE FROM product WHERE id = ?"
    try{
        const [result] = await db.execute(sql, [req.id]);
        console.log("Produto deletado com sucesso");
        return result;
    }catch(err){
        throw new Error(`Erro ao deletar produto: ${err}`);
    }
}

module.exports = {
    viewAllProduct,
    viewProduct,
    newProduct,
    updateProduct,
    deleteProduct
}
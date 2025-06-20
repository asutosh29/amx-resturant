const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

// Connections
const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    database: process.env.DBNAME
})
conn.connect((err) => {
    if (err) throw err;
    console.log("DB Connected successfully")
})

function runDB(query, params = []) {
    return new Promise((resolve, reject) => {
        conn.query(query, params, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    });
}


// // // USER QUERIES
async function checkEmail(user) {
    const CHECK = `select * from users where email=?`;
    const result = await runDB(CHECK, [user.email]);
    if (result.length === 0) return false;
    return result[0];
}
async function checkUsername(user) {
    const CHECK = `select * from users where username=?`;
    const result = await runDB(CHECK, [user.username]);
    if (result.length === 0) return false;
    return result[0];
}
async function addUser(user) {
    const QUERY = `insert into users(email, username,userRole,first_name,last_name,contact, hashpwd) values(?,?,?,?,?,?,?)`;
    const params = [user.email, user.username, user.userRole, user.first_name, user.last_name, user.contact, user.hashpwd];
    const all = await runDB(QUERY, params);
    return true;
}
async function makeAdminById(id) {
    const QUERY = `update users set userRole = ? where id = ?`;
    const result = await runDB(QUERY, ["admin", id]);
    return id;
}
async function makeCustomerById(id) {
    const QUERY = `update users set userRole = ? where id = ?`;
    const result = await runDB(QUERY, ["customer", id]);
    return id;
}
async function deleteUser(id) {
    // TBD
    // Example: const QUERY = `delete from users where id = ?`;
    // await runDB(QUERY, [id]);
    console.log('user deleted successfully')
    return "OK"
}
async function getUser(user) {
    const QUERY = `select * from users where email=?`;
    const all = await runDB(QUERY, [user.email]);
    return all[0];
}
async function getAllUsers() {
    const QUERY = `select * from users`;
    const all = await runDB(QUERY);
    return all;
}
async function isFirstUser(){
    const QUERY = `select * from users`;
    const result = await runDB(QUERY);
    if(result.length ===0) return true;
    else false;
}

// // // Item Queries
async function getAllItems() {
    const QUERY = `select * 
    from items 
    JOIN category
    ON items.category_id = category.category_id`
    const all = await runDB(QUERY)
    return all
}
async function getAllItemsByCategory(category) {
    const category_list = [
        'Appetizers',
        'Main Course',
        'Desserts',
        'Beverages',
        'Salads',
        'Soups',
        'Snacks',
        'Combos'
    ]
    const notInList = category_list.find(e => e === category)
    
    if(!notInList){
        return null
    }
    const QUERY = `select * 
    from items 
    JOIN category
    ON items.category_id = category.category_id
    WHERE category_name=?`;
    const all = await runDB(QUERY, [category]);
    return all;
}
async function getAllItemsBySearch(search) {
    const QUERY = `select * 
    from items 
    JOIN category
    ON items.category_id = category.category_id
    WHERE item_name like ?`;
    const all = await runDB(QUERY, ["%" + search + "%"]);
    return all;
}
async function getAllCategories(){
    const QUERY = `select * from category`;
    const all = await runDB(QUERY);
    const categories = all.map(e => e.category_name);
    return categories;
}
async function getItemById(id){
    const QUERY = `select * 
    from items 
    JOIN category
    ON items.category_id = category.category_id
    WHERE item_id = ?`;
    const all = await runDB(QUERY, [id]);
    return all;
}


// // // ORDER QUERIES
async function getAllOrders() {
    const QUERY = `select * 
                from orders 
                JOIN tables 
                ON tables.table_id = orders.table_id
                JOIN users 
                ON orders.customer_id = users.id
                JOIN order_item
                on orders.order_id = order_item.order_id
                JOIN items
                on items.item_id = order_item.item_id
                ORDER BY orders.order_id DESC;`;
    const all = await runDB(QUERY);
    return all;
}
async function addOrder(instructions, item_qty, reqUser) {
    const user = await getUser(reqUser)
    const customer_id = parseInt(user.id)

    const tables = await availableTables()
    const table_id = tables.length !== 0 ? parseInt(tables[0].table_id) : null
    if (!table_id) return null

    const TABLE = await setTable(table_id, 0)
    if (TABLE === -1) {
        return null
    }

    const extra_instructions = instructions
    let total_amount = 0

    const date = new Date();
    const order_at_time = date.toISOString().slice(0, 19).replace('T', ' ');

    let ids = []
    item_qty.forEach(e => {
        ids.push(parseInt(e.id))
    });
    idString = ids.join(' , ')
    const ITEMS = `select * 
                    from items
                    where item_id in (${idString}) `

    const items = await runDB(ITEMS)
    item_qty.forEach(e => {
        items.forEach(item => {
            let qty = parseFloat(e.qty)
            let price = item.item_id == e.id ? item.price : 0
            price = parseFloat(price)
            total_amount += qty * price
        });
    });



    const QUERY = `insert into orders(customer_id, table_id, extra_instructions, total_amount, order_at_time)
                    values(?, ?, ?, ?, ?)`;
    const all = await runDB(QUERY, [customer_id, table_id, extra_instructions, total_amount, order_at_time]);
    const orderID = all.insertId;
    for (const it_qt of item_qty) {
        let ORDER_ITEM = `insert into order_item(item_id, order_id, qty) value(?, ?, ?);`;
        await runDB(ORDER_ITEM, [parseInt(it_qt.id), orderID, parseInt(it_qt.qty)]);
    }
    return { orderID: orderID, tableID: table_id };
}
async function getOrder(id) {
    const QUERY = `select * 
                from orders 
                JOIN tables 
                ON tables.table_id = orders.table_id
                JOIN users 
                ON orders.customer_id = users.id
                JOIN order_item
                on orders.order_id = order_item.order_id
                JOIN items
                on items.item_id = order_item.item_id
                WHERE orders.order_id = ?
                ORDER BY orders.order_id DESC;`;
    const result = await runDB(QUERY, [id]);
    return result;
}
async function getAllOrdersByOrder() {
    const IDS = `select distinct order_id  from orders`
    const ids = await runDB(IDS)
    const payload = []
    let orders = ids.map(e => e.order_id)
    for (const order_id of orders) {
        const temp = await getOrder(parseInt(order_id))
        payload.push(temp)
    }
    return payload
}
async function getAllOrdersByOrderByCategory(category) {
    const IDS = `select distinct order_id  from orders  where order_status = ?`;
    const ids = await runDB(IDS, [category]);
    const payload = [];
    let orders = ids.map(e => e.order_id);
    for (const order_id of orders) {
        const temp = await getOrder(parseInt(order_id))
        payload.push(temp)
    }
    return payload
}
async function getAllOrdersByOrderByUserId(id) {
    const IDS = `select distinct order_id  from orders where customer_id = ?`;
    const ids = await runDB(IDS, [id]);
    const payload = [];
    let orders = ids.map(e => e.order_id);
    for (const order_id of orders) {
        const temp = await getOrder(parseInt(order_id))
        payload.push(temp)
    }
    return payload
}



// // // Order Status QUERIES
async function markOrderPlacedById(id) {
    const QUERY = `update orders
                    set order_status = 'placed'
                    where order_id  = ?;`;
    const TABLE = `select table_id from orders where order_id = ?`;
    const table_result = await runDB(TABLE, [parseInt(id)]);
    const table_id = parseInt(table_result[0].table_id);
    await setTable(table_id, 0);
    const all = await runDB(QUERY, [parseInt(id)]);
    return all;
}
async function markOrderServedById(id) {
    const QUERY = `update orders
                    set order_status = 'served'
                    where order_id  = ?;`;
    const TABLE = `select table_id from orders where order_id = ?`;
    const table_result = await runDB(TABLE, [parseInt(id)]);
    const table_id = parseInt(table_result[0].table_id);
    await setTable(table_id, 1);
    const all = await runDB(QUERY, [parseInt(id)]);
    return all;
}
async function markOrderCookingById(id) {
    const QUERY = `update orders
                    set order_status = 'cooking'
                    where order_id  = ?;`;
    const TABLE = `select table_id from orders where order_id = ?`;
    const table_result = await runDB(TABLE, [parseInt(id)]);
    const table_id = parseInt(table_result[0].table_id);
    await setTable(table_id, 0);
    const all = await runDB(QUERY, [parseInt(id)]);
    return all;
}
async function markOrderBilledById(id) {
    const QUERY = `update orders
                    set order_status = 'billed'
                    where order_id  = ?;`;
    const TABLE = `select table_id from orders where order_id = ?`;
    const table_result = await runDB(TABLE, [parseInt(id)]);
    const table_id = parseInt(table_result[0].table_id);
    const result = await setTable(table_id, 0);
    const all = await runDB(QUERY, [parseInt(id)]);
    return all;
}
async function markOrderPaidById(id) {
    const QUERY = `update orders
                    set order_status = 'paid'
                    where order_id  = ?;`;
    const TABLE = `select table_id from orders where order_id = ?`;
    const table_result = await runDB(TABLE, [parseInt(id)]);
    const table_id = parseInt(table_result[0].table_id);
    const result = await setTable(table_id, 1);
    const all = await runDB(QUERY, [parseInt(id)]);
    return all;
}

// TABLE Queries
async function availableTables() {
    const QUERY = `select * 
                from tables 
                where isAvailable=1
                `
    const all = await runDB(QUERY)
    return all
}
async function setTable(table_id, status) {
    if (status !== 1 && status !== 0) {
        return -1
    }
    const QUERY = `update tables set isAvailable=${status} where table_id=${table_id}`
    const result = await runDB(QUERY)
    return table_id
}


module.exports = {
    conn, runDB, 
    checkEmail, addUser, getUser, checkUsername, getAllUsers, deleteUser,makeAdminById,makeCustomerById,isFirstUser,
    getAllItems,getAllItemsByCategory,getAllCategories,getAllItemsBySearch,getItemById,
    getAllOrders, addOrder, getOrder, getAllOrdersByOrder,getAllOrdersByOrderByUserId,getAllOrdersByOrderByCategory,
    markOrderBilledById,markOrderPaidById,markOrderPlacedById, markOrderServedById, markOrderCookingById
}
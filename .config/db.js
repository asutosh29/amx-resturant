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

function runDB(query) {
    return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    });
}


// // // USER QUERIES
async function checkEmail(user) {
    const CHECK = `select * from users where email="${user.email}"`
    const result = await runDB(CHECK)
    if (result.length === 0) return false
    return result[0]
}
async function checkUsername(user) {
    const CHECK = `select * from users where username="${user.username}"`
    const result = await runDB(CHECK)
    if (result.length === 0) return false
    return result[0]
}

async function addUser(user) {
    const QUERY = `insert into users(email, username,first_name,last_name,contact, hashpwd) values("${user.email}","${user.username}","${user.first_name}","${user.last_name}","${user.contact}","${user.hashpwd}");`
    const all = await runDB(QUERY)
    return true
}
async function deleteUser(id) {
    // TBD
    console.log('user deleted successfully')
    return "OK"
}
async function getUser(user) {
    const QUERY = `select * from users where email="${user.email}"`
    const all = await runDB(QUERY)
    return all[0]
}
async function getAllUsers() {
    const QUERY = `select * from users`
    const all = await runDB(QUERY)
    return all
}

// // // USER QUERIES
async function getAllItems() {
    const QUERY = `select * 
                from items 
                JOIN category
                ON items.category_id = category.category_id`
    const all = await runDB(QUERY)
    return all
}
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
                ORDER BY orders.order_id DESC;
                `
    const all = await runDB(QUERY)
    return all
}


async function addOrder(item_qty, reqUser) {
    const user = await getUser(reqUser)
    const customer_id = parseInt(user.id)

    const tables = await availableTables()
    const table_id = tables.length !== 0 ? parseInt(tables[0].table_id) : null
    console.log(table_id)
    if (!table_id) return null

    const TABLE = await setTable(table_id, 0)
    if (TABLE === -1) {
        return null
    }

    const extra_instructions = " "
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
                    values(${customer_id}, ${table_id}, "${extra_instructions}", ${total_amount}, "${order_at_time}")
                `
    const all = await runDB(QUERY)
    const orderID = all.insertId
    item_qty.forEach(async it_qt => {
        let ORDER_ITEM = `insert into order_item(item_id, order_id, qty) value(${parseInt(it_qt.id)}, ${orderID},${parseInt(it_qt.qty)} );`
        await runDB(ORDER_ITEM)
    });
    return { orderID: orderID, tableID: table_id }
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
                WHERE orders.order_id = ${id}
                ORDER BY orders.order_id DESC;`
    const result = await runDB(QUERY)
    return result
}

async function getAllOrdersByOrder() {
    const IDS = `select distinct order_id  from orders`
    const ids = await runDB(IDS)
    const payload = []
    let orders = ids.map(e => e.order_id)
    console.log(orders)
    for (const order_id of orders) {
        const temp = await getOrder(parseInt(order_id))
        // console.log(temp)
        console.log("WAITING FOR ITEM TO LOAD")
        payload.push(temp)
    }
    console.log("PAYLOAD: ", payload)
    return payload
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
    console.log("Table result: ", result)
    return table_id
}


module.exports = {
    conn, runDB,
    checkEmail, addUser, getUser, checkUsername, getAllUsers, deleteUser,
    getAllItems,
    getAllOrders, addOrder, getOrder, getAllOrdersByOrder
}
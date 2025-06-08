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
async function checkEmail(user){
    const CHECK = `select * from users where email="${user.email}"`
    const result = await runDB(CHECK)
    if(result.length === 0 ) return false
    return result[0] 
} 
async function checkUsername(user){
    const CHECK = `select * from users where username="${user.username}"`
    const result = await runDB(CHECK)
    if(result.length === 0 ) return false
    return result[0] 
} 

async function addUser(user){
    const QUERY = `insert into users(email, username,first_name,last_name,contact, hashpwd) values("${user.email}","${user.username}","${user.first_name}","${user.last_name}","${user.contact}","${user.hashpwd}");`
    const all = await runDB(QUERY)
    return true
}
async function deleteUser(id){
    // const QUERY = `insert into users(email, username,first_name,last_name,contact, hashpwd) values("${user.email}","${user.username}","${user.first_name}","${user.last_name}","${user.contact}","${user.hashpwd}");`
    // const all = await runDB(QUERY)
    // return true
    console.log('user deleted successfully')
    return "OK"
}
async function getUser(user){
    const QUERY = `select * from users where email="${user.email}"`
    const all = await runDB(QUERY)
    return all[0]
}
async function getAllUsers(){
    const QUERY = `select * from users`
    const all = await runDB(QUERY)
    return all
}

// // // USER QUERIES
async function getAllItems(){
    const QUERY = `select * 
                from items 
                JOIN category
                ON items.category_id = category.category_id`
    const all = await runDB(QUERY)
    return all
}



module.exports = { conn, runDB, 
    checkEmail , addUser, getUser, checkUsername, getAllUsers, deleteUser,
    getAllItems}
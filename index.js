const express = require('express');
const path = require('path');
const staticRouter = require('./routes/static.js')

const app = express()
PORT = 8080

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))

app.use('/',staticRouter)


app.listen(PORT, ()=>{console.log(`Server started at PORT: ${PORT}`)})
const express = require('express');
const path = require('path');
const staticRouter = require('./routes/static.js')
const adminRouter = require('./routes/admin.js')
const {log} = require('./middlewares/log.js')

const cookieParser = require('cookie-parser')

const app = express()
PORT = 8080

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(log)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/',staticRouter)
app.use('/admin',adminRouter)

app.get('/',(req,res)=>{
    res.redirect('/home')
})


app.listen(PORT, ()=>{console.log(`Server started at PORT: ${PORT}`)})

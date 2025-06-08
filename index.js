const express = require('express');
const path = require('path');
const staticRouter = require('./routes/static.js')
const adminRouter = require('./routes/admin.js')
const userRouter = require('./routes/user.js')
const itemRouter = require('./routes/item.js')

const {log} = require('./middlewares/log.js')
const {restrictToLoggedInUser, restrictToAdmin} = require('./middlewares/authMiddlewares.js')

const cookieParser = require('cookie-parser')

const app = express()
PORT = 8080

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(log)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.resolve('./public')))

app.use('/',staticRouter)
app.use('/admin',restrictToLoggedInUser, restrictToAdmin,adminRouter)
app.use('/user',restrictToLoggedInUser,userRouter)
app.use('/item',restrictToLoggedInUser,itemRouter)

app.get('/',(req,res)=>{
    res.redirect('/home')
})


app.listen(PORT, ()=>{console.log(`Server started at PORT: ${PORT}`)})

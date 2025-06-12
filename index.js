const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config()

const staticRouter = require('./routes/static.js')
const adminRouter = require('./routes/admin.js')
const userRouter = require('./routes/user.js')
const itemRouter = require('./routes/item.js')
const orderRouter = require('./routes/order.js')
const {log} = require('./middlewares/log.js')
const {restrictToLoggedInUser, restrictToAdmin} = require('./middlewares/authMiddlewares.js')


const app = express()
PORT = 8080

// VIEWS
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

// MIDDLE WARES 
app.use(log)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
   }));
app.use(express.json())
app.use(express.static(path.resolve('./public')))

// ROUTES
app.use('/',staticRouter)
app.use('/admin',restrictToLoggedInUser, restrictToAdmin,adminRouter)
app.use('/user',restrictToLoggedInUser,userRouter)
app.use('/item',restrictToLoggedInUser,itemRouter)
app.use('/order',restrictToLoggedInUser,orderRouter)

app.get('/',(req,res)=>{
    res.redirect('/home')
})


app.listen(PORT, ()=>{console.log(`Server started at PORT: ${PORT}`)})

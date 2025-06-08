const express = require('express');
const { restrictToLoggedInUser, restrictToNewUser,restrictToAdmin } = require('../middlewares/authMiddlewares.js')
const {getAllUsers, getAllItems} = require('../.config/db.js')

const router = express.Router()

router.get('/', restrictToLoggedInUser, restrictToAdmin, (req,res)=>{
    const user = req.user
    return res.render('admin', { user: user })
})

router.route('/users')
.get(async (req,res)=>{

    const users = await getAllUsers()

    const user = req.user
    return res.render('./admin/admin_users', { user: user , users:users})

})

router.route('/inventory')
.get(async (req,res)=>{
    const user = req.user
    const allItems = await getAllItems()
    return res.render('./admin/admin_inventory', { user: user , items:allItems})    
})

router.route('/orders')
.get((req,res)=>{
    const user = req.user
    return res.render('./admin/admin_orders', { user: user })    
})

module.exports = router
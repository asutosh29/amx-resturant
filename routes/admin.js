const express = require('express');
const { restrictToLoggedInUser, restrictToNewUser,restrictToAdmin } = require('../middlewares/authMiddlewares.js')
const {getAllUsers, getAllItems, getAllOrders, getAllOrdersByOrder} = require('../.config/db.js')

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
.get(async (req,res)=>{
    const user = req.user
    const allOrders = await getAllOrders()
    return res.render('./admin/admin_orders', { user: user ,orders:allOrders})    
})

router.route('/chef')
.get(async (req,res)=>{
    const user = req.user
    const allOrders = await getAllOrdersByOrder()
    console.log(allOrders)
    return res.render('./admin/admin_chef', { user: user ,orders:allOrders})    
})

module.exports = router
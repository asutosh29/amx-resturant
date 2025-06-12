const express = require('express');
const {getAllOrders, addOrder, runDB, getOrder, markOrderPlacedById, markOrderCookingById, markOrderServedById} = require('../.config/db.js')

const router = express.Router()

router.route('/')
.get(async (req,res)=>{
    const allOrders = await getAllOrders()
    res.json(allOrders)
})
.post(async (req,res)=>{
    const orderDetails = await addOrder(req.body, req.user)
    if(!orderDetails){ 
        req.session.message = "No tables empty"
        return res.json({url: '/home'})
    }
    console.log("orderDetails: ", orderDetails)
    req.session.orderID = orderDetails.orderID
    req.session.tableID = orderDetails.tableID
    return res.json({url: '/payment'})
})
router.route('/:id')
.get(async (req,res)=>{
    const orderID = req.params.id
    const order = await getOrder(orderID)
    res.json(order)
})


router.patch('/placed/:id',async (req,res)=>{
    const orderId = req.params.id
    const result = await markOrderPlacedById(orderId)
    return res.json({message: `order with Id ${orderId} is placed`})
})
router.patch('/cooking/:id',async (req,res)=>{
    const orderId = req.params.id
    const result = await markOrderCookingById(orderId)
    return res.json({message: `order with Id ${orderId} is cooking`})
})
router.patch('/served/:id',async (req,res)=>{
    const orderId = req.params.id
    const result = await markOrderServedById(orderId)
    return res.json({message: `order with Id ${orderId} is served`})
})



module.exports = router
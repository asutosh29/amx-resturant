const express = require('express');
const router = express.Router()

const { deleteUser, getAllOrdersByOrderByUserId, getUser } = require('../.config/db.js')

router.route('/:id')
    .delete(async (req, res) => {
        const id = req.params.id
        const result = await deleteUser(id);
        return res.json({ message: "Deleted successfully" })
    })

router.route('/orders')
    .get(async (req, res) => {
        const user = req.user
        const dbUser = await getUser(user)
        const allOrders = await getAllOrdersByOrderByUserId(dbUser.id)
        return res.render('./user/orders', { user: user, orders: allOrders })
    })

module.exports = router
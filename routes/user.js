const express = require('express');
const router = express.Router()

const { deleteUser, getAllOrdersByOrderByUserId, getUser, makeAdminById } = require('../.config/db.js')

router.route('/:id')
    .delete(async (req, res) => {
        const id = req.params.id
        const result = await deleteUser(id);
        return res.json({ message: "Deleted successfully" })
    })
    .patch(async (req, res) => {
        const id = req.params.id
        const result = await makeAdminById(id);
        return res.json({ message: `user id ${id} made admin successfully` })
    })

router.route('/orders')
    .get(async (req, res) => {
        const user = req.user
        const dbUser = await getUser(user)
        const allOrders = await getAllOrdersByOrderByUserId(dbUser.id)
        return res.render('./user/orders', { user: user, orders: allOrders.reverse() })
    })

module.exports = router
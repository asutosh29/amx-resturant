const express = require('express');
const { restrictToLoggedInUser, restrictToNewUser, restrictToAdmin } = require('../middlewares/authMiddlewares.js')
const { getAllUsers, getAllItems, getAllOrders, getAllOrdersByOrder, getAllOrdersByOrderByCategory, makeCustomerById, makeAdminById } = require('../.config/db.js');
const { paginate } = require('../utils/pagination.js');

const router = express.Router()

router.get('/', (req, res) => {
    const user = req.user
    return res.render('admin', { user: user })
})




router.route('/users',)
    .get(async (req, res) => {
        const users = await getAllUsers()
        const user = req.user
        return res.render('./admin/admin_users', { user: user, users: users })

    })
router.route('/:id',)
    .patch(async (req, res) => {
        const id = req.params.id
        const result = await makeAdminById(id);
        return res.json({ message: `user id ${id} made admin successfully` })
    })
    .delete(async (req, res) => {
        const id = req.params.id
        const result = await makeCustomerById(id);
        return res.json({ message: `user id ${id} made customer successfully` })
    })
    
    

router.route('/inventory')
    .get(async (req, res) => {
        const user = req.user
        const allItems = await getAllItems()
        return res.render('./admin/admin_inventory', { user: user, items: allItems })
    })

router.route('/orders_all')
    .get(async (req, res) => {
        // Displays all orders in table format
        const user = req.user
        const allOrders = await getAllOrders()
        return res.render('./admin/admin_orders', { user: user, orders: allOrders })
    })

router.route('/orders')
    .get(async (req, res) => {
        const category = req.query?.category
        const categoryList = ['placed', 'cooking', 'served', 'billed', 'paid']
        const user = req.user
        let page = parseInt(req.query?.page)
        let allOrders = null
        let total = 0
        if (!page) {
            page = 1
        }

        // Category check
        const catInList = categoryList.find(e => e === category)
        if (!catInList) {
            allOrders = await getAllOrdersByOrder();
            const result = paginate(allOrders, page)
            allOrders = result[0]
            total = result[1]
            return res.render('./admin/orders', { user: user, orders: allOrders, total: total, page: page, categories: ['all', 'placed', 'cooking', 'served', 'billed', 'paid'] })
        }

        allOrders = await getAllOrdersByOrderByCategory(category);
        const result = paginate(allOrders, page)
        allOrders = result[0]
        total = result[1]
        return res.render('./admin/orders', { user: user, orders: allOrders, total: total, page: page, categories: ['all', 'placed', 'cooking', 'served', 'billed', 'paid'] })
    })

router.route('/chef')
    .get(async (req, res) => {
        const user = req.user
        const allOrders = await getAllOrdersByOrder()
        return res.render('./admin/admin_chef', { user: user, orders: allOrders })
    })

module.exports = router
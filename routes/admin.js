const express = require('express');
const { restrictToLoggedInUser, restrictToNewUser,restrictToAdmin } = require('../middlewares/authMiddlewares.js')

const router = express.Router()

router.get('/', restrictToLoggedInUser, restrictToAdmin, (req,res)=>{
    const user = req.user
    res.render('admin', { user: user })
})

module.exports = router
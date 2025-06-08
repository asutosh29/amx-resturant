const express = require('express');
const {deleteUser} = require('../.config/db.js')

const router = express.Router()

router.route('/:id')
.delete(async (req,res)=>{
    const id = req.params.id
    const result = await deleteUser(id);
    return res.json({message: "Deleted successfully"})
})

module.exports = router
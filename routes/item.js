const express = require('express');
const {getAllItems, runDB} = require('../.config/db.js')



const router = express.Router()

router.route('/')
.get(async (req,res)=>{
    const allItems = await getAllItems()
    res.json(allItems)
})
.patch(async (req,res)=>{
    const QUERY = `UPDATE items SET isAvailable=${req.body.isAvailable} WHERE item_id=${req.body.itemId}`
    const result = await runDB(QUERY)
    res.json({message: `Item id: ${req.body.itemId} marked as ${req.body.isAvailable}`})
})


module.exports = router
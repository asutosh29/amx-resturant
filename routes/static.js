const express = require('express')

const router = express.Router()

router.route('/login')
.get((req,res)=>{
    return res.render('login')
})
.post((req,res)=>{
    console.log(req.body)
    // Input check
    const user = req.body

    // Validate user (JWT)
    
    // Send JWT token in cokie

    if(!(user.email === 'test@test.com' && user.password === '123')) return res.redirect('/login')

    res.redirect('/home')
})

router.route('/register')
.get((req,res)=>{
    return res.render('register')
})
.post((req,res)=>{
    console.log(req.body)
    // Input check if all paramters given

    // Add user to DB

    // Prompt user to login
    return res.redirect('/login')

})


router.get('/home',(req,res)=>{
    res.render('home')
})

module.exports = router
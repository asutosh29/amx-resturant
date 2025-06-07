const express = require('express')
const { runDB } = require('../.config/db.js')
const { setUserJWT, getUserJWT } = require('../utils/jwtauth.js')


const router = express.Router()

router.route('/login')
    .get((req, res) => {
        return res.render('login')
    })
    .post(async (req, res) => {
        console.log(req.body)
        // Input check
        if (!req.body.email || !req.body.password) return res.redirect('/login')

        const reqUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        // Check if user DNE
        const CHECK = `select * from users where email="${reqUser.email}"`
        const result = await runDB(CHECK)
        if (result.length == 0) return res.render('login', { message: "User doesn't exists! Please Register!" })

        // Check password 
        const user = result[0]
        console.log('DB USER: ',user)
        const hashpwd = reqUser.password // do the hashing step

        if(user.hashpwd !== hashpwd) return res.render('login',{message: "Wrong password"})

        // Create JWT token
        const payload = {
            username: user.username,
            email: user.email
        }

        // Send JWT token in cookie
        const token = setUserJWT(payload)
        console.log("JWT: ", token)
        res.cookie('token_id', token)

        return res.redirect('home')
    })

router.route('/register')
    .get((req, res) => {



        return res.render('register')
    })
    .post(async (req, res) => {
        console.log(req.body)
        // Input check if all paramters given
        if (!req.body.username || !req.body.email || !req.body.password) return res.redirect('/register')
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        // Check if user exists
        const CHECK = `select * from users where email="${user.email}"`
        const result = await runDB(CHECK)
        if (result.length != 0) return res.render('register', { message: "User already exists! Please Login!" })
        // password hashing


        // Add user to DB
        const email = user.email
        const username = user.username
        const hashpwd = user.password
        const QUERY = `insert into users(email, username, hashpwd) values("${email}","${username}","${hashpwd}");`
        const all = await runDB(QUERY)

        // Prompt user to login
        return res.redirect('/login')

    })


router.get('/home', (req, res) => {
    res.render('home')
})

router.route('/test')
    .get(async (req, res) => {
        const QUERY = `select * from users`
        const all = await runDB(QUERY)
        res.json(all)
    })
    .post(async (req, res) => {
        const email = "test@test.com"
        const username = "testUser"
        const hashpwd = "hash"
        const QUERY = `insert into users(email, username, hashpwd) values("${email}","${username}","${hashpwd}");`
        const all = await runDB(QUERY)
        res.json(all)
    })


module.exports = router
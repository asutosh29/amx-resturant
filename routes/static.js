const express = require('express')
const { runDB, checkEmail, checkUsername, addUser, getUser } = require('../.config/db.js')
const { setUserJWT, getUserJWT } = require('../utils/jwtauth.js')
const { restrictToLoggedInUser, restrictToNewUser } = require('../middlewares/authMiddlewares.js')

const { genSalt, genHash, checkPassword } = require('../utils/hashing.js')


const router = express.Router()

router.use('/login', restrictToNewUser)
router.route('/login')
    .get((req, res) => {
        return res.render('login', { message: " " })
    })
    .post(async (req, res) => {
        console.log(req.body)
        // Input check
        if (!req.body.email || !req.body.password) return res.redirect('/login')

        const reqUser = {
            email: req.body.email,
            password: req.body.password
        }
        // Check if user DNE
        if (await checkEmail(reqUser.email)) return res.render('login', { message: "User doesn't exists! Please Register!", category: "danger" })
        
        // Get real user from DB     
        const user = await getUser(reqUser)
        console.log('DB USER: ', user)

        // Check password 
        if (!(await checkPassword(reqUser.password, user.hashpwd))) return res.render('login', { message: "Wrong password", category: "danger" })

        // Create JWT token
        const payload = {
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            contact: user.contact,
            hashpwd: user.hashpwd
        }

        // Send JWT token in cookie
        const token = setUserJWT(payload)
        console.log("JWT: ", token)
        res.cookie('token_id', token)

        return res.redirect('home')
    })

router.use('/register', restrictToNewUser)
router.route('/register')
    .get((req, res) => {
        return res.render('register')
    })
    .post(async (req, res) => {
        console.log(req.body)
        // Input check
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name || !req.body.contact) return res.redirect('/register', { message: "Bad Input", category: "danger" })
        
        // Password hashing
        const SALT = await genSalt(10)
        const HASH = await genHash(req.body.password, SALT)

        const user = {
            username: req.body.username,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            contact: req.body.contact,
            hashpwd: HASH
        }

        // Check for unique username and password
        if (await checkEmail(user)) return res.render('register', { message: "User already exists! Please Login!", category: "danger" })
        if (await checkUsername(user)) return res.render('register', { message: "Username is already taken!", category: "danger" })
        
        // Add user to DB
        await addUser(user)

        return res.redirect('/login')

    })


router.get('/logout', restrictToLoggedInUser, (req, res) => {
    res.clearCookie('token_id')
    return res.redirect('/login')
})


router.get('/home', restrictToLoggedInUser, (req, res) => {
    const user = req.user
    console.log(user)
    res.render('home', { user: user })
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
const {Router} = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

router.post(
    '/register',
    [
        check('email', 'Fail email!').isEmail(),
        check('password', 'Minimum length password - 6 symbols!').isLength({ min:6 }),
    ],
    async (req, res) => {
    try {

        console.log(req.body)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Fail data for registration!'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({ email: email })

        if (candidate) {
            return res.status(400).json({message: 'User with this email already exists!'})
        }

        const hashedPassword = await bcryptjs.hash(password, 12)
        const user = new User({ email: email, password: hashedPassword })

        await user.save()

        res.status(201).json({ message: 'User has been created!' })

    } catch (error) {
        res.status(500).json({ message: 'Something go wrong.. Try again..' })
    }
})

router.post(
    '/login',
    [
        check('email', 'Enter correct email!').normalizeEmail().isEmail(),
        check('password', 'Enter correct password!').exists()
    ],
    async (req, res) => {
    try {

        console.log(req.body)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Fail data for login!'
            })
        }

        const {email, password} = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User with this email wasn`t find!' })
        }

        const isEqualPassword = await bcryptjs.compare(password, user.password)

        if (!isEqualPassword) {
            return res.status(400).json({ message: 'Incorrect password, try again!' })
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        console.log(token)
        res.json({ message: "User has been Login!", token: token, userId: user.id })

    } catch (error) {
        res.status(500).json({ message: 'Something go wrong.. Try again..' })
    }
})

module.exports = router

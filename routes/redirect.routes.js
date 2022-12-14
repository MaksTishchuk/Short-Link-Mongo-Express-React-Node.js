const {Router} = require('express')
const Link = require('../models/Link')

const router = Router()

router.get('/:code', async (req, res) => {
    try {
        const link = await Link.findOne({ code: req.params.code })

        if (link) {
            link.clicks++
            console.log(link.clicks)
            await link.save()
            return res.redirect(link.from)
        }

        res.status(404).json('Link has not find!')

    } catch (error) {
        res.status(500).json({ message: 'Something go wrong.. Try again..' })
    }
})

module.exports = router

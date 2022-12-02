const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const server = express()

server.use(express.json({ extended: true }))

server.use('/api/auth', require('./routes/auth.routes'))
server.use('/api/link', require('./routes/link.routes'))
server.use('/to', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    server.use('/', express.static(path.join(__dirname, 'client', 'build')))
    server.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('PORT') || 3000

async function start() {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        server.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (error) {
        console.log('Server Error', error.message)
        process.exit(1)
    }
}

start()

const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const authen = require('../middleware/authen')
const { welcomeEmail, cancelEmail } = require('../emails/account')
const User = require('../models/users')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.getAuthenToken()
        await user.save();
        welcomeEmail(user.email, user.name);
        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByProperty(req.body.email, req.body.password)
        const token = await user.getAuthenToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', authen, async (req, res) => {
    try {
        req.user.token = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send('Logged out successfully')

    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', authen, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send('Logged out successfully')
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', authen, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', authen, async (req, res) => {
    const keys = Object.keys(req.body)
    const properties = ["name", "email", "password", "age"]
    const valid = keys.every((key) => {
        return properties.includes(key)
    })

    if (!valid) {
        return res.status(400).send({ 'error': 'Invalid updates' })
    }

    try {
        keys.forEach((property) => req.user[property] = req.body[property])

        await req.user.save()
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', authen, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }

        cancelEmail(req.user.email, req.user.name)
        req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        // if (!file.originalname.endsWith('.pdf')) {
        //     return callback(new Error('Upload pdf file'))
        // }

        // if (!file.originalname.match(/\.(doc|.docx)$/)) {
        //     return callback(new Error('Upload word document'))
        // }

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Upload image(.jpg, .jpeg, .png format only)'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', authen, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ 'error': error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }

})

router.delete('/users/me/avatar', authen, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.send()
})


module.exports = router

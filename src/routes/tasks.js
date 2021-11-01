const express = require('express')
const Task = require('../models/tasks')
const authen = require('../middleware/authen')
const router = new express.Router()

router.post('/tasks', authen, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Filtering     //GET /tasks?completed=false
//Pagination    //GET /tasks?limit=5&skip=0
//Sorting       //Get /tasks?sortBy=createdAt:desc
router.get('/tasks', authen, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = (req.query.completed === 'true')
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'desc' ? -1 : 1)
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id })
        // res.send(tasks)
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', authen, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', authen, async (req, res) => {
    const keys = Object.keys(req.body)
    const props = ["description", "completed"]
    const valid = keys.every((task) => {
        return props.includes(task)
    })

    if (!valid) {
        return res.status(400).send({ 'error': "Invalid property" })
    }

    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        keys.forEach((property) => task[property] = req.body[property])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidatotrs: true })
        res.send(task)
    }
    catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/tasks/:id', authen, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
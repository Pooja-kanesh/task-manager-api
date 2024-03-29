const express = require('express')
require('./database/mongoose')
const userRouter = require('./routes/users')
const taskRouter = require('./routes/tasks')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server started " + port)
})
const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
}).then(() => {
    console.log('db connected')
}).catch((e) => {
    console.log(e)
})


// const user3 = new User({
//     name: 'Chibi  ',
//     email: ' meaumeau@email.io',
//     age: 5
// })

// user3.save().then(() => {
//     console.log(user3)
// }).catch((error) => {
//     console.log(error)
// })

// const task4 = new Task({
//     description: '     take medicine',
// })

// task4.save().then(() => {
//     console.log(task4)
// }).catch((error) => {
//     console.log(error)
// }) 
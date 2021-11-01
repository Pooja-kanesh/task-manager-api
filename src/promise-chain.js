require('./database/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')

// User.findByIdAndUpdate('61642c4e7d7c62fc2136c535', { age: 21 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 21 })
// }).then((result) => {
//     console.log(result)
// }).catch((err) => {
//     console.log(err)
// })

// Task.findByIdAndDelete('6162d3a5d1e10797213bee34').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((err) => {
//     console.log(err)
// })

const updateUser = async (id, age) => {
    await User.findByIdAndUpdate('6162ecfd7bc495f51a60b7e3', { age })
    const cnt = await User.countDocuments({ age: 21 })

    return cnt
}

updateUser('6162ecfd7bc495f51a60b7e3', 21).then((cnt) => {
    console.log(cnt)
}).catch((err) => {
    console.log(err)
})



// const deleteTaskAccount = async (id) => {
//     await Task.findByIdAndDelete(id)
//     const count = await Task.countDocuments({ completed: false })

//     return count
// }

// deleteTaskAccount('6162d50f560da85162fcade6').then((result) => {
//     console.log(result)
// }).catch((err) => {
//     console.log(err)
// })

// const sgAPIKey = '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'
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'poojakanesh@outlook.com',
        pass: 'qwerty@12345'
    }
});

// send mail with defined transport object
const welcomeEmail = (email, name) => {
    transporter.sendMail({
        from: '"Task Manager App" <poojakanesh@outlook.com>', // sender address
        to: email, // list of receivers
        subject: "Welcome to Task-Manager", // Subject line
        text: `Welcome ${name}. Hope you enjoy our services` // plain text body
    })
}

const cancelEmail = (email, name) => {
    transporter.sendMail({
        from: '"Task Manager App" <poojakanesh@outlook.com>',
        to: email,
        subject: "Goodbye! from Task-Manager",
        text: `Goodbye ${name}, to see you leave. Hope you enjoyed our services`
    })
}

module.exports = {
    welcomeEmail,
    cancelEmail
}

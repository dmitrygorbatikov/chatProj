const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
    },
    regDateTime:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', schema)

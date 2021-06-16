const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true
    },
    regDateTime:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', schema)

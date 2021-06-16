const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    chatCreator:{
        type: Object,
        required: true
    },
    secondUser:{
        type: Object,
        required: true
    },
    messages: {
        type: Array,
        required: true,
    },
    regDateTime:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Chat', schema)

const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const cors = require('cors');



const app = express()
app.use(express.json())

app.use(cors())


const PORT = config.get('port')

app.use('/api/auth', require('./auth/auth.routes'))
app.use('/api/chat', require('./chat/chat.routes'))

function start(){
    try{
        mongoose.connect(config.get('mongoUri'), {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true
            },
            () => console.log('MongoDB connected')
        )
        app.listen(PORT, () => {
            console.log('Server started')
        })
    }
    catch (e) {
        console.log(e);
    }
}
start()
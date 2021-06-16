const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const events = require('events')

const emitter = new events.EventEmitter();


class chatController{
    async createChat(req,res){
        try{
            const user = await User.findById(req.user.userId)
            const secondUser = await User.findById(req.body.id)

            const candidate = await Chat.findOne({
                $or: [
                    {chatCreator: secondUser, secondUser: user},
                    {secondUser: secondUser, chatCreator: user}
                ]
            })

            if(candidate){
                return res.status(200).json({message: 'Чат с этим пользователем уже создан'})
            }

            const chat = new Chat({
                chatCreator: user,
                secondUser: secondUser,
                messages: [],
                regDateTime: new Date().toLocaleString('ru',
                    {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: "numeric",
                        minute: "numeric"
                    })
            })
            await chat.save()
            return res.status(200).json(chat)
        }
        catch (e) {
            return res.status(400).json({message:'Что-то пошло не так, попробуйте снова'})
        }
    }

    async getUserChats(req,res){
        try{
            await Chat.find(
            ).then((chats) => {
                let n = []
                for (let i = 0; i < chats.length; i++) {
                    if(chats[i].chatCreator._id.toString() == req.user.userId.toString() || chats[i].secondUser._id.toString() == req.user.userId.toString()){
                        console.log(true)
                        n.push(chats[i])
                    }
                }
                return res.status(200).json(n)
            })
        }
        catch (e) {
            return res.status(400).json({message:'Что-то пошло не так, попробуйте снова'})
        }
    }

    async createMessage(req,res){
        try{
            const message = new Message({
                text: req.body.message,
                from: req.user.userId,
                to: req.body.to,
                chatId: req.body.chatId,
                regDateTime:
                    new Date().toLocaleString('ru',
                    {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: "numeric",
                        minute: "numeric"
                    })
            })
            await message.save()

            // emitter.emit('newMessage', message)
            return res.status(200).json(message)
        }
        catch (e) {
            console.log(e)
        }
    }

    async getMessages(req,res){
        await Message.find({chatId: req.query.chatId}).then((messages) => {
            return res.status(200).json(messages)
        })

    }

}

module.exports = new chatController()
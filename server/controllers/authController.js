const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

class AuthController{
    async register(req,res){
        try{
            const candidate = await User.findOne({ email: req.body.login })

            if (candidate) {
                return res.json({message: 'Такой пользователь уже существует'})
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 12)

            const user = new User({
                name: req.body.name,
                surname: req.body.surname,
                login: req.body.login,
                password: hashedPassword,
                regDateTime: new Date().toLocaleString('ru',
                    {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: "numeric",
                        minute: "numeric"
                    })
            })


            await user.save()
            res.status(200).json({message: 'Пользователь создан!'})

        } catch (e) {
            res.status(400).json({message: e.message})
        }
    }

    async login(req,res){
        try {
            const {login, password} = req.body

            const user = await User.findOne({login})

            if(!user){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(400).json({message:'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),

            )
            return res.status(200).send({token, userId: user.id, user: user})
        }
        catch (e) {
            return res.status(400).json({message:'Что-то пошло не так, попробуйте снова'})
        }
    }

    async getAllUsers(req,res){
        try{
            await User.find().then((users) => {
                return res.status(200).json(users)
            })
        }
        catch (e) {
            return res.status(400).json({message:'Что-то пошло не так, попробуйте снова'})
        }
    }

    async getUserData(req,res){
        try{
            await User.findById(req.user.userId).then((user) => {
                return res.status(200).json(user)
            })
        }
        catch (e) {
            return res.status(400).json({message:'Что-то пошло не так, попробуйте снова'})
        }
    }

    async updateUserData(req,res){
        try{
            const oldPassword = req.body.password
            const user = await User.findById(req.user.userId)
            const isMatch = await bcrypt.compare(oldPassword, user.password)
            const newPassword = req.body.newPassword
            let password = ""

            if((oldPassword.length == 0 && newPassword.length > 0) || (newPassword.length == 0 && oldPassword.length > 0)){
                return res.status(400).json({message: "Введите пароль"})
            }
            else if(oldPassword.length == 0 && newPassword.length == 0){
                password = user.password
            }
            else if(oldPassword.length > 0 && newPassword.length > 0 && isMatch){
                password = await bcrypt.hash(req.body.newPassword, 12)
            }
            else if(!isMatch){
                return res.status(400).json({message: "Старый пароль неверный"})
            }
            const login = req.body.login

            await User.find({login: 1}).then((loginArray) => {
                for (let i = 0; i < loginArray.length; i++) {
                    if(login != user.login && loginArray[i] == login){
                        return res.status(200).json({message: "Этот логин занят, попробуйте другой"})
                    }
                }
            })

            let body = {
                'name': req.body.name ?? user.name,
                'surname': req.body.surname ?? user.surname,
                'login': login ?? user.login,
                'password': password
            }
            await User.findByIdAndUpdate(req.user.userId, body).then(() => {
                return res.status(200).json({message: "Пользователь успешно изменён"})
            })
        }
        catch (e) {
            return res.status(400).json({message:'Что-то пошло не так, попробуйте снова'})
        }
    }


}

module.exports = new AuthController()
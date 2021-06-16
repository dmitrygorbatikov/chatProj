const {Router} = require('express')
const router = Router()
const chatController = require('../controllers/chatController')
const auth = require('../middleware/auth.middleware')

router.post('/create-chat', auth, chatController.createChat)
router.get('/get-user-chats', auth, chatController.getUserChats)
router.post('/create-message', auth, chatController.createMessage)
router.get('/get-message', auth, chatController.getMessages)




module.exports = router
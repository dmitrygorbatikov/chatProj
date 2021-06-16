const {Router} = require('express')
const router = Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth.middleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/get-all-users', auth, authController.getAllUsers)
router.get('/get-user-data', auth, authController.getUserData)
router.patch('/update-user-data', auth, authController.updateUserData)




module.exports = router
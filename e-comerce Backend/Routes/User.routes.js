const router = require('express').Router()
const userCtrl = require('../controllers/User_controller')
 const {validationCheck} = require('../middleware/data.checker')





router.post('/register',validationCheck, userCtrl.register)
router.post('/login',userCtrl.login)
// router.post('/password-reset',userCtrl.password)



module.exports=router
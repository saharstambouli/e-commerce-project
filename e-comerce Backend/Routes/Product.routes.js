const router = require('express').Router()
const productCtrl = require('../controllers/Product_controller')






router.get('/upload', productCtrl.upload)
router.get('/:productId', productCtrl.getProductById)
router.delete('/delete', productCtrl.deleteProduct)






module.exports=router
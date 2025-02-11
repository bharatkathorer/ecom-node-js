const route = require('express').Router();
const authController = require('../../../controller/api/backend/authenticationController');
const productController = require('../../../controller/api/backend/productController');
const orderController = require('../../../controller/api/backend/orderController');
const userController = require('../../../controller/api/backend/userController');
const {userRegisterRequest, userLoginRequest} = require("../../../validation/userAuthenticationRequests");
const {authAdmin} = require("../../../middleware/authMidlleware");
const {productStoreRequest} = require("../../../validation/productRequests");
const {uploadFile} = require("../../../services/fileService");
const {adminOrderUpdateRequest} = require("../../../validation/cartRequests");


//authentication routes
route.get('/admin', authAdmin, authController.index)
route.post('/register', userRegisterRequest, authController.register)
route.post('/login', userLoginRequest, authController.login)
route.post('/logout', authAdmin, authController.logout)

//products routes
route.get('/products', [authAdmin], productController.index);
route.post('/products', [uploadFile('product_image', 'storage/products'), authAdmin, productStoreRequest], productController.store);
route.get('/products/:product_id', [authAdmin], productController.edit);
route.put('/products/:product_id', [uploadFile('product_image', 'storage/products'), authAdmin, productStoreRequest], productController.update);
route.delete('/products/:product_id', [authAdmin], productController.destroy);


//orders
route.get('/orders', [authAdmin], orderController.index);
route.get('/orders/:order_id', [authAdmin], orderController.view);
route.post('/orders', [authAdmin, adminOrderUpdateRequest], orderController.update);

route.get('/users', userController.index);


module.exports = route;

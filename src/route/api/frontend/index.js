const route = require('express').Router();
const authController = require('../../../controller/api/frontend/authenticationController');
const {userRegisterRequest, userLoginRequest} = require("../../../validation/userAuthenticationRequests");
const {auth} = require("../../../middleware/authMidlleware");
const productController = require('../../../controller/api/frontend/productController')
const cartController = require('../../../controller/api/frontend/cartController')
const orderController = require('../../../controller/api/frontend/orderController')
const addressController = require('../../../controller/api/frontend/addressController')
const {addCartRequest, checkOutRequest} = require("../../../validation/cartRequests");
const {addressRequest} = require("../../../validation/addressRequest");


// authentications routes
route.get('/user', auth, authController.index)
route.post('/user/register', userRegisterRequest, authController.register)
route.post('/user/login', userLoginRequest, authController.login)
route.post('/user/google-auth', authController.googleAuth)

route.post('/user/logout', auth, authController.logout)


//products routes
route.get('/products', productController.index);
route.get('/products/:product_id', productController.view);

//cart routes
route.get('/carts', [auth], cartController.index);
route.post('/carts', [auth, addCartRequest], cartController.store);

//orders
route.get('/orders', [auth], orderController.index);
route.post('/orders/checkout', [auth, checkOutRequest], orderController.checkout);

// addresses
route.get('/addresses', [auth], addressController.index);
route.post('/addresses', [auth, addressRequest], addressController.store);
route.get('/addresses/:address_id', [auth], addressController.view);
route.put('/addresses/:address_id', [auth,addressRequest], addressController.update);
route.delete('/addresses/:address_id', [auth], addressController.destroy);
route.post('/addresses/set-default', [auth], addressController.setDefault);

module.exports = route;

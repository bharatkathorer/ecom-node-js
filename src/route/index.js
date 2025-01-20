const router = require('express').Router();
const backendRoutes = require('./api/backend/index');
const frontendRoutes = require('./api/frontend/index');
const adminRoutes = require('./admin/index');
const responseMiddleware = require('./../middleware/responseMiddleware');


router.get('/', (req, res) => {
    return res.send('this is welcome page');
})
router.use(responseMiddleware);
router.use('/admin', adminRoutes);
router.use('/api/', frontendRoutes);
router.use('/api/backend', backendRoutes);

module.exports = router;

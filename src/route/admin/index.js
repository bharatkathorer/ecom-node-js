const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send('This is a admin panel route');
});

module.exports = router;

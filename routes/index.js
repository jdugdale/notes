var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('index', { title: 'Express', uid: req.user.uid });
});

router.get('/data', async(req, res) => {
    res.json({
        val: 'yes',
        entries: [
            { day: '20190318', value: 'this is data 1' },
            { day: '20190320', value: 'this is data 2' }
        ]
    })
});

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('index', { title: 'Express', uid: req.user.name });
});

router.get('/data', async(req, res) => {
    const db = require('../lib/db');
    let data = await db.getAll(req.user.name);
    res.json(data);
    // res.json({
    //     val: 'yes',
    //     entries: [
    //         { day: '20190318', value: 'this is data 1' },
    //         { day: '20190320', value: 'this is data 2' }
    //     ]
    // })
});

router.post('/data', async(req, res) => {
    console.log(req.body);
    const db = require('../lib/db');
    await db.saveAll(req.user.name, {
        val: 'yes',
        entries: req.body
    });
    res.send('done');
});

module.exports = router;
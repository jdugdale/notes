const router = require('express').Router();
const Auth = require('../lib/auth');

router.post('/', async (req, res) => {
    let { uid, pwd } = req.body;
    console.log(uid + '-' + pwd);
    const db = require('../lib/db');
    await db.createAccount(uid, pwd);
    await Auth.login(uid, pwd, res);
    
    res.redirect('/');
});

module.exports = router;

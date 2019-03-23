const router = require('express').Router();
const Auth = require('../lib/auth');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    let { uid, pwd } = req.body;
    let isValid = await Auth.login(uid, pwd, res);
    if(isValid)
        res.redirect('/');
    else
        res.render('login', { error: true });
    // const cia = require('../lib/cia');
    // let enc = cia.encrypt(JSON.stringify(user));
    // res.cookie('auth', enc, { signed: true });
    // res.redirect('/');
});

module.exports = router;
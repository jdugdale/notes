const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    let user = { uid: req.body.uid };
    const cia = require('../lib/cia');
    let enc = cia.encrypt(JSON.stringify(user));
    res.cookie('auth', enc, { signed: true });
    res.redirect('/');
});

module.exports = router;
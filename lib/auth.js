const CIA = require('./cia');
const TIMEOUT_MINUTES = 10;

class Auth {
    static async login(name, pwd, res) {
        const db = require('./db');
        console.log('auth.login: ' + name + pwd);
        let isValid = await db.checkAccount(name, pwd);
        console.log(isValid);
        if(isValid) {
            let user = { name };
            let cia = new CIA();
            let cookie = cia.encrypt(JSON.stringify(user));
            res.cookie('auth', cookie, { maxAge: 1000 * 60 * TIMEOUT_MINUTES, signed: true });
        }
        return isValid;
    }

    static async checkLogin(req, res) {
        let cia = new CIA();
        req.user = req.signedCookies.auth ? JSON.parse(cia.decrypt(req.signedCookies.auth)) : null;
        if (req.user) {
            res.cookie('auth', req.signedCookies.auth, { maxAge: 1000 * 60 * TIMEOUT_MINUTES, signed: true });
            return true;
        } else
            return false;
    }
}

module.exports = Auth;
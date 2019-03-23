const crypto = require('crypto'),
    alg = 'aes192',
    encodingHide = 'hex',
    encodingShow = 'utf8';

class CIA {
    constructor(pwd) {
        this.pwd = pwd || process.env.COOKIE_AUTH_KEY;
    }
    
    encrypt(text) {
        const cipher = crypto.createCipher(alg, this.pwd);
        let encypted = cipher.update(text, encodingShow, encodingHide);
        encypted += cipher.final(encodingHide);
        return encypted;
    }

    decrypt(encrypted) {
        const decipher = crypto.createDecipher(alg, this.pwd);
        let decrypted = decipher.update(encrypted, encodingHide, encodingShow);
        decrypted += decipher.final(encodingShow);
        return decrypted;
    }
}

module.exports = CIA;
const crypto = require('crypto'),
    alg = 'aes192',
    pwd = process.env.COOKIE_AUTH_KEY,
    encodingHide = 'hex',
    encodingShow = 'utf8';

module.exports = {
    encrypt: function(text) {
        const cipher = crypto.createCipher(alg, pwd);
        let encypted = cipher.update(text, encodingShow, encodingHide);
        encypted += cipher.final(encodingHide);
        return encypted;
    },
    decrypt: function(encrypted) {
        const decipher = crypto.createDecipher(alg, pwd);
        let decrypted = decipher.update(encrypted, encodingHide, encodingShow);
        decrypted += decipher.final(encodingShow);
        return decrypted;
    }
}
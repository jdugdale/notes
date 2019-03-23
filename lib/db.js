const Azure = require('./azure-bs-simple');
const bs = new Azure.BlobService();
const CIA = require('./cia');

class Db {
    static checkAccount(acctName, acctPwd) {
        return new Promise((resolve, reject) => {
            try {
                bs.get('diary', `${acctName}/user`, blob => {
                    if (blob.startsWith('The specified blob does not exist.'))
                        resolve(false);
                    else {
                        console.log(blob);
                        console.log(JSON.parse(blob));
                        console.log(acctPwd);
                        let saved = JSON.parse(blob);
                        let cia = new CIA();
                        let provided = cia.encrypt(acctPwd);
                        resolve(saved === provided);
                    }
                });
            } catch (e) {
                console.log('checkAccoutn error');
                console.error(e);
                resolve(false);
            }
        });
    }

    static createAccount(acctName, acctPwd) {
        return new Promise((resolve, reject) => {
            try {
                let cia = new CIA();
                bs.post('diary', `${acctName}/user`, cia.encrypt(acctPwd), p => resolve());
            } catch (e) {
                reject(e);
            }
        });
    }

    static getAll(acctName) {
        return new Promise((resolve, reject) => {
            try {
                bs.get('diary', `${acctName}/all`, text => {
                    if (text.startsWith('The specified blob does not exist.'))
                        resolve('');
                    else {
                        bs.get('diary', `${acctName}/user`, blob => {
                            console.log(blob);
                            let pwd = JSON.parse(blob);
                            let cia = new CIA(pwd);
                            let decrypted = cia.decrypt(JSON.parse(text));
                            resolve(JSON.parse(decrypted));
                        });
                    }
                })
            } catch(e) {
                reject(e);
            }
        })
    }

    static saveAll(acctName, data) {
        return new Promise((resolve, reject) => {
            try {
                bs.get('diary', `${acctName}/user`, blob => {
                    let pwd = JSON.parse(blob);
                    let cia = new CIA(pwd);
                    let encrypted = cia.encrypt(JSON.stringify(data));
                    bs.post('diary', `${acctName}/all`, encrypted, p => resolve());
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    static getDates(acctName) {
        return new Promise((resolve, reject) => {
            try {
                bs.listDirectory('diary', `${acctName}/data`, blobs => {
                    resolve(blobs.entries.map(b => b.name));
                });
            } catch (err) {
                reject(err);
            }
        });

    }

    static getEntry(acctName, date) {
        return new Promise((resolve, reject) => {
            try {
                bs.get('diary', `${acctName}/data/${date}`, text => {
                    if (text.startsWith('The specified blob does not exist.'))
                        resolve('');
                    else {
                        bs.get('diary', `${acctName}/user`, blob => {
                            console.log(blob);
                            let pwd = JSON.parse(blob);
                            let cia = new CIA(pwd);
                            let decrypted = cia.decrypt(JSON.parse(text));
                            resolve(decrypted);
                        });
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static saveEntry(acctName, date, text) {
        return new Promise((resolve, reject) => {
            try {
                bs.get('diary', `${acctName}/user`, blob => {
                    let pwd = JSON.parse(blob);
                    let cia = new CIA(pwd);
                    let encrypted = cia.encrypt(text);
                    bs.post('diary', `${acctName}/data/${date}`, encrypted, p => resolve());
                })
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = Db;
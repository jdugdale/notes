const router = require('express').Router();
const path = require('path');
const Store = require('lf-common-client').Store;

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('sanity')
    if(req.query['code'] === 'bobbysue')
        res.sendFile(path.join(__dirname, '../ui', 'dist'));
    else
        res.sendStatus(403);
});

router.get('/api/note', async (req, res) => {
    let id = req.query['id']
    if (id)
        res.send(await getNote(id));
    else {
        let list = await getNoteList();
        res.send(list);
    }
    res.end();
});

async function getNote(id) {
    let store = new Store();
    let note = await store.getJSON('notes/' + id);
    console.log(note);
    return note;
}

async function getNoteList() {
    let store = new Store();
    let list = await store.list('notes/');
    //let list = await store.getJSON('notes-list');
    return list;
}

router.post('/api/note', async (req, res) => {
    try {
        let id = req.query['id'];
        let store = new Store();
        console.log(req.body);
        console.log(typeof req.body);
        await store.post('notes/' + id, req.body)
        res.send(req.body);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.get('/api/notes', async (req, res) => {
    let store = new Store();
    //await store.post('notes-all', []);
    let notes = await store.getJSON('notes-all');
    res.send(notes);
});

router.post('/api/notes', async (req, res) => {
    let store = new Store();
    let apires = await store.post('notes-all', req.body);
    res.send();
});

module.exports = router;

class Api {
    constructor() {
        this._store = window.sessionStorage;
    }

    async refreshDb() {
        return new Promise((resolve, reject) => {

            let store = this._store;
            function dataReceived() {
                let data = this.responseText;
                store.clear();
                store.setItem('loaded', new Date().valueOf());
                let json = JSON.parse(data);
                if (json.entries) {
                    json.entries.forEach(j => {
                        store.setItem('_' + j.day, j.value);
                    });
                }
                resolve();
            }

            let http = new XMLHttpRequest();
            http.addEventListener('load', dataReceived);
            http.open('GET', '/data');
            http.send();
        });
    }

    async saveDb() {
        return new Promise((resolve, reject) => {
            function dataReceived() {
                let response = this.responseText;
                console.log(response);
                resolve();
            }

            let data = this.getEntries().map(e => { return { day: e.key.substr(1), value: e.value } });
            let http = new XMLHttpRequest();
            http.addEventListener('load', dataReceived);
            http.open('POST', '/data');
            http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            http.send(JSON.stringify(data));
        });
    }

    getEntries() {
        let result = [];
        for (let i = 0; i < this._store.length; i++) {
            let key = this._store.key(i);
            if (key.startsWith('_')) {
                let mom = moment(key.substr(1), 'YYYYMMDD');
                let day = mom.format('MMM D, YYYY');
                let sorter = mom.valueOf();
                result.push({ day, key, sorter, value: this._store.getItem(key) });
            }
        }

        let today = '_' + moment().format('YYYYMMDD');
        if (!result.find(d => d.key === today)) {
            result.push({
                day: moment().format('MMM D, YYYY'),
                key: today,
                sorter: moment().valueOf(),
                value: ''
            });
        }

        result.sort((a, b) => b.sorter - a.sorter);
        return result;
    }

    getOne(key) {
        return this._store.getItem(key);
    }

    setOne(key, value) {
        this._store.setItem(key, value);
    }

}


const vue = new Vue({
    el: '#app',
    data() {
        return {
            api: new Api(),
            loading: false,
            isSaving: false,
            entries: [],
            current: {}
        };
    },
    mounted() {

    },
    async created() {
        await this.api.refreshDb();
        this.loadData();
        if (this.entries.length > 0)
            this.current = this.entries[0];
        this.$el.querySelectorAll('textarea')[0].focus();
    },
    methods: {
        loadData() {
            this.entries = this.api.getEntries();
        },
        setCurrent(entry) {
            this.current = entry;
        },
        update: _.debounce(function (e) {
            this.current.value = e.target.value;
            this.api.setOne(this.current.key, this.current.value);
        }, 300),
        async save() {
            this.isSaving = true;
            await this.api.saveDb();
            this.isSaving = false;
        }
    }
});
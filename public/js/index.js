let data = {
    coolness: 'init me',
    loading: false,
    entries: [],
    current: null
};

function dataReceived() {
    let data = this.responseText;
    console.log(data);
    window.sessionStorage.clear();
    window.sessionStorage.setItem('loaded', new Date().valueOf());
    let json = JSON.parse(data);
    json.entries.forEach(j => {
        window.sessionStorage.setItem('_' + j.day, j.value);
    });
    vue.loadData();
    vue.loading = false;
}

function loadData() {
    for (let i = 0; i < window.sessionStorage.length; i++) {
        let key = window.sessionStorage.key(i);
        if (key.startsWith('_')) {
            let day = key.substr(1);
            this.entries.push({ day: day, key: key });
        }
    }
}

function loadDate(key) {
    this.current = {
        key: key,
        value: window.sessionStorage.getItem(key)
    };
}

function onCreated() {

}

function onMounted() {
    if (!window.sessionStorage.getItem('loaded')) {
        this.loading = true;
        let http = new XMLHttpRequest();
        http.addEventListener('load', dataReceived);
        http.open('GET', '/data');
        http.send();
    } else {
        this.loadData();
    }
}

function doSomething() {
    alert('did something');
}

const vue = new Vue({
    el: '#app',
    data() { return data; },
    mounted: onMounted,
    created: onCreated,
    methods: {
        doSomething,
        loadData,
        loadDate
    }
});
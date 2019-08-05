<template lang="pug">
  #app
    nav
        ul
            li(v-for="n of notes"): a(href="", @click.prevent="loadNote(n)") {{n.title}}
        hr
        a(href="", @click.prevent="addNote()") +New note
        p
            a(v-show="needSave", href="", @click.prevent="save()", :disabled="isSaving") {{isSaving ? 'Saving...' : 'Save'}}
    
    #editor(v-show="editMode")
        textarea(v-if="activeNote", v-model="activeNote.text")
    #preview
        a.edit-btn(v-show="activeNote && !editMode", href="", @click.prevent="edit()") Edit
        div(v-html="markdown", @click="edit()")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NoteEdit from "./components/NoteEdit.vue";
import marked from "marked";
import axios from 'axios';

class Note {
    id:string = '';
    name:string = '';
    text:string = '';
    get title():string {
        if(!this.text) return this.name;
        let match = this.text.match(/^# (.+)/);
        return match && match.length > 1 ? match[1].substr(0,80) : 'New note';
    }
}

@Component({
    components: {
        NoteEdit
    }
})
export default class App extends Vue {
    notes:Note[] = [];
    activeNote:Note|null = null;
    editMode: boolean = false;
    original: string = '';
    isSaving: boolean = false;

    private loadData(data: string[]) {
        this.notes.splice(0, this.notes.length);
        data.forEach((d:string) => {
            let n = new Note();
            n.text = d;
            this.notes.push(n);
        });
    }

    async mounted() {
        let cached = window.localStorage.getItem('notes');
        if(cached)
            this.loadData(cached.split('||'));
        let res = await axios.get('/api/notes');
        //let res = { data: ['# First note', '# Second note'] };
        
        this.original = res.data.join('||');
        if(this.original != cached)
            this.loadData(res.data);
    }

    async loadNote(n:Note) {
        this.activeNote = n;
        this.editMode = false;
    }

    get markdown(): string {
        if(!this.activeNote) return '';
        return marked(this.activeNote.text);
    }

    get name(): string {
        if(!this.activeNote) return '';
        let match = this.activeNote.text.match(/^# (.+)/);
        return match && match.length > 1 ? match[1].substr(0,80) : 'New note';
    }

    get needSave(): boolean {
        return this.original != this.notes.map(n => n.text).join('||');
    }

    async addNote() {
        let n = new Note();
        n.text = '# New note';
        this.notes.push(n);
        this.activeNote = n;
        this.edit();
    }

    async save() {
        this.isSaving = true;
        let res = await axios.post('/api/notes', this.notes.map(n => n.text));
        this.editMode = false;
        this.original = this.notes.map(n => n.text).join('||');
        window.localStorage.setItem('notes', this.original);
        this.isSaving = false;
    }

    edit() {
        this.editMode = true;
        (<HTMLTextAreaElement>this.$el.querySelector('textarea')).focus();
    }

}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

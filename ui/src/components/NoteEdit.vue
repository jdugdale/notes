<template lang="pug">
    .note
        .editor
            textarea(v-model="editText", @input="update")
        #preview(v-html="markdown")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import marked from "marked";
import _ from "lodash";

@Component
export default class NoteEdit extends Vue {
    @Prop() private title!: string;
    @Prop() private text!: string;
    
    editText: string = this.text;

    get markdown(): string {
        return marked(this.editText);
    }

    get name(): string {
        let match = this.editText.match(/^# (.+)/);
        return match && match.length > 1 ? match[1].substr(0,80) : 'New note';
    }

    update() {
        //this.$emit
        //console.log(this.editText)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

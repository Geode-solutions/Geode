<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn flat v-on="on">
        <v-icon>publish</v-icon>
        <span>LOAD</span>
      </v-btn>
    </template>

    <v-card v-for="(input, index) in inputs" :key="index">
      <input
        :id="'Input' + input.name"
        type="file"
        multiple
        style="display:none;"
        @change="load_file(input)"
      />
      <v-card-title class="headline grey lighten-2" primary-title>
        {{ input.name }}
      </v-card-title>

      <v-card-actions>
        <v-btn color="primary" flat @click="show_input(input.name)">
          load
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapState("ui",["inputs"])
  },
  methods: {
    show_input(name) {
      const input = document.getElementById("Input" + name);
      input.value = null;
      input.click();
    },
    load_file({ name, action }) {
      const files = document.getElementById("Input" + name).files;
      for (let i = 0; i < files.length; i++) {
        this.$store.dispatch(action, files.item(i).path);
      }
      this.dialog = false;
    }
  }
};
</script>

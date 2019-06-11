<template>
  <v-treeview v-model="tree" :items="items" selectable return-object>
  </v-treeview>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data: () => ({
    tree: []
  }),
  computed: {
    ...mapState(["proxyManager"]),
    ...mapGetters(["items"]),
    selections() {
      console.log("selections");
      const selections = [];
      this.tree.forEach(node => {
        if (node.source) {
          selections.push(node);
        }
      });
      return selections;
    }
  },
  watch: {
    selections: function(new_selections, old_selections) {
      old_selections
        .filter(item => new_selections.indexOf(item) < 0)
        .forEach(item => this.set_visibility(item.source, false));
      new_selections
        .filter(item => old_selections.indexOf(item) < 0)
        .forEach(item => this.set_visibility(item.source, true));
    }
  },
  methods: {
    set_visibility(source, visible) {
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === source)
        .forEach(r => r.setVisibility(visible));
    }
  }
};
</script>

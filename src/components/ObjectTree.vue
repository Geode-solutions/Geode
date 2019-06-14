<template>
  <v-treeview
    v-model="selected_tree"
    :items="items"
    :active.sync="active"
    activatable
    selectable
  >
  </v-treeview>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["proxyManager", "data"]),
    ...mapGetters({
      items: "treeview/items"
    }),
    active: {
      get() {
        return this.$store.state.treeview.active;
      },
      set(value) {
        this.$store.commit("treeview/update_active", value);
      }
    },
    selected_tree: {
      get() {
        return this.$store.state.treeview.selected_tree;
      },
      set(value) {
        this.$store.commit("treeview/update_selected_tree", value);
      }
    },
    selections() {
      const selections = [];
      this.selected_tree.forEach(id => {
        const node = this.data.find(item => item.id === id);
        if (node && node.source) {
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

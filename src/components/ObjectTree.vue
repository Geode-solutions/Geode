<template>
  <v-treeview
    v-model="selectedTree"
    :items="items"
    :active.sync="active"
    activatable
    selectable
  />
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
        this.$store.commit("treeview/updateActive", value);
      }
    },
    selectedTree: {
      get() {
        return this.$store.state.treeview.selectedTree;
      },
      set(value) {
        this.$store.commit("treeview/updateSelectedTree", value);
      }
    },
    selections() {
      const selections = [];
      this.selectedTree.forEach(id => {
        const node = this.data.find(item => item.id === id);
        if (node && node.source) {
          selections.push(node);
        }
      });
      return selections;
    }
  },
  watch: {
    selections: function(newSelections, oldSelections) {
      oldSelections
        .filter(item => newSelections.indexOf(item) < 0)
        .forEach(item => this.setVisibility(item.source, false));
      newSelections
        .filter(item => oldSelections.indexOf(item) < 0)
        .forEach(item => this.setVisibility(item.source, true));
    }
  },
  methods: {
    setVisibility(source, visible) {
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === source)
        .forEach(r => r.setVisibility(visible));
    }
  }
};
</script>

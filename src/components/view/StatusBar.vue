<template>
  <v-expand-transition>
    <v-toolbar
      v-if="active_object"
      color="primary lighten"
      style="position: absolute; bottom: 0;"
    >
      <v-toolbar-items>
        <v-layout row>
          <v-flex d-flex>
            <v-select
              v-model="representation"
              color="accent"
              :items="representations"
              label="Representation"
              @change="change_representation"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-toolbar-items>
    </v-toolbar>
  </v-expand-transition>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StatusBar",
  data() {
    return {
      representations: ["Surface", "Surface with edges", "Wireframe", "Points"]
    };
  },
  computed: {
    ...mapState(["proxyManager", "data"]),
    ...mapState("treeview", ["active"]),
    active_object() {
      if (this.active.length) {
        const node = this.data.find(item => item.id === this.active[0]);
        if (node && node.source) {
          return node;
        }
      }
      return;
    },
    representation() {
      if (this.active_object) {
        return this.proxyManager
          .getRepresentations()
          .find(r => r.getInput() === this.active_object.source)
          .getRepresentation();
      }
      return;
    }
  },
  methods: {
    change_representation() {
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === this.active_object.source)
        .forEach(r => r.setRepresentation(this.representation));
    }
  }
};
</script>

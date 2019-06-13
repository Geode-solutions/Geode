<template>
  <v-toolbar v-if="show" color="primary">
    <v-toolbar-items>
      <v-layout row align-start>
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
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "StatusBar",
  data() {
    return {
      representation: "",
      representations: [
        { text: "Surface", value: "Surface" },
        { text: "Surface with edges", value: "Surface with edges" },
        { text: "Wireframe", value: "Wireframe" },
        { text: "Points", value: "Points" }
      ]
    };
  },
  computed: {
    ...mapState(["proxyManager"]),
    ...mapGetters({
      active_object: "treeview/active_object"
    }),
    show() {
      return this.active_object.length;
    }
  },
  methods: {
    change_representation() {
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === this.active_object[0].source)
        .forEach(r => r.setRepresentation(this.representation));
    }
  }
};
</script>

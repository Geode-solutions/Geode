<template>
  <v-layout column>
    <v-breadcrumbs :items="path">
      <template v-slot:item="props">
        <a @click="updateBreadcrumbs(props.item.text)">{{
          props.item.text.charAt(0).toUpperCase() + props.item.text.slice(1)
        }}</a>
      </template>
    </v-breadcrumbs>
    <v-layout row wrap justify-space-around align-center>
      <v-flex v-for="(node, index) in nodes" :key="index" xs3 ma-2>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-card
              raised
              :class="$style.roundedCard"
              hover
              @click="
                node.action
                  ? show_input(node.name)
                  : path.push({ text: node.name })
              "
              v-on="on"
            >
              <input
                v-if="node.action"
                :id="'Input' + node.name"
                type="file"
                multiple
                style="display:none;"
                @change="load_file(node)"
              />
              <v-card-actions class="justify-center align-center">
                <v-icon size="200">
                  {{ node.icon }}
                </v-icon>
              </v-card-actions>
            </v-card>
          </template>
          <span>{{ node.tooltip }}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: "DataManagerImport",
  data: () => ({
    path: [{ text: "import" }]
  }),
  computed: {
    nodes() {
      return this.$store.getters["ui/filteredInputs"](
        this.path[this.path.length - 1].text
      );
    }
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
    },
    updateBreadcrumbs(text) {
      const index = this.path.findIndex(item => item.text === text);
      this.path.splice(index + 1);
    }
  }
};
</script>

<style module>
.roundedCard {
  border-radius: 50px;
}
</style>

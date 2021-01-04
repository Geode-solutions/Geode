<!--
Copyright (C) 2019 - 2021 Geode-solutions

This file is a part of Geode library.

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.
-->

<template>
  <v-row>
    <v-col>
      <v-breadcrumbs :items="path">
        <template v-slot:item="props">
          <a @click="updateBreadcrumbs(props.item.text)">{{
            props.item.text.charAt(0).toUpperCase() + props.item.text.slice(1)
          }}</a>
        </template>
      </v-breadcrumbs>
      <v-row justify="space-around" align="center">
        <v-col
          v-for="(node, index) in nodes"
          :key="index"
          class="ma-2"
          cols="3"
        >
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-card
                raised
                :class="$style.roundedCard"
                hover
                @click="
                  node.action
                    ? showInput(node.name)
                    : path.push({ text: node.name })
                "
                v-on="on"
              >
                <input
                  v-if="node.action"
                  :id="'Input' + node.name"
                  type="file"
                  multiple
                  style="display: none"
                  @change="loadFile(node)"
                />
                <v-card-actions class="justify-center align-center">
                  <component
                    :is="node.component"
                    v-if="node.component"
                    style="height: 200px; width: 200px"
                  />
                  <v-icon v-else-if="node.icon" size="200">
                    {{ node.icon }}
                  </v-icon>
                  <v-icon v-else size="200"> fas fa-question </v-icon>
                </v-card-actions>
              </v-card>
            </template>
            <span>{{ node.tooltip }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DataManagerImport",
  data: () => ({
    path: [{ text: "import" }],
  }),
  computed: {
    nodes() {
      return this.$store.getters["ui/filteredInputs"](
        this.path[this.path.length - 1].text
      );
    },
  },
  methods: {
    showInput(name) {
      const input = document.getElementById("Input" + name);
      input.value = null;
      input.click();
    },
    loadFile({ name, action }) {
      const files = document.getElementById("Input" + name).files;
      for (let i = 0; i < files.length; i++) {
        this.$store.dispatch(action, files.item(i).path);
      }
      this.dialog = false;
    },
    updateBreadcrumbs(text) {
      const index = this.path.findIndex((item) => item.text === text);
      this.path.splice(index + 1);
    },
  },
};
</script>

<style module>
.roundedCard {
  border-radius: 50px;
}
</style>

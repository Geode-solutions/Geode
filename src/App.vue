<!--
Copyright (C) 2019 - 2022 Geode-solutions

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
  <v-app>
    <create-point v-model="dialog" />
    <v-app-bar app dark clipped-left color="primary">
      <v-btn text class="pa-0" @click="visible = !visible">
        <v-app-bar-nav-icon>
          <v-icon large> $vuetify.icons.logo </v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>Geode-solutions</v-toolbar-title>
      </v-btn>
      <v-spacer />
      <v-btn text icon @click="showInput">
        <v-icon>fas fa-layer-group</v-icon>
        <input
          ref="input"
          type="file"
          accept=".js"
          multiple
          style="display: none"
          @change="loadModule"
        />
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="visible"
      stateless
      app
      clipped
      @transitionend="hide_drawer"
    >
      <v-row
        class="fill-height flex-nowrap"
        no-gutters
        @contextmenu.ctrl="dialog = true"
      >
        <route-selector visible="visible" />
        <object-tree style="overflow-x: hidden" />
      </v-row>
    </v-navigation-drawer>
    <v-main>
      <router-view v-if="connected" />
      <v-progress-circular
        v-if="busy"
        indeterminate
        color="primary"
        style="position: absolute; bottom: 10px; right: 10px"
        >{{ spinner }}</v-progress-circular
      >
    </v-main>
  </v-app>
</template>

<script>
import CreatePoint from "./components/CreatePoint";
import RouteSelector from "./components/RouteSelector";
import ObjectTree from "./components/ObjectTree";
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
import path from "path";

export default {
  components: {
    CreatePoint,
    RouteSelector,
    ObjectTree,
  },
  data: () => ({
    dialog: false,
    visible: true,
  }),
  computed: {
    ...mapState("network", ["connected", "busy"]),
    spinner() {
      return this.busy > 1 ? this.busy : "";
    },
  },
  mounted() {
    const cwd = ipcRenderer.sendSync("cwd");
    this.$store.dispatch("loadConfigFile", path.join(cwd, "config.json"));

    const port = ipcRenderer.sendSync("port");
    const config = Object.assign({}, this.$store.getters["network/config"], {
      sessionURL: "ws://localhost:" + port + "/ws",
    });
    // if (this.token) {
    //   config.secret = this.token;
    // }

    this.$store.commit("network/set_config", config);
    this.$store.dispatch("network/connect");
  },
  methods: {
    hide_drawer() {
      this.$root.$emit("hide_drawer");
    },
    showInput() {
      const input = this.$refs.input;
      input.value = null;
      input.click();
    },
    loadModule() {
      const files = this.$refs.input.files;
      for (let i = 0; i < files.length; i++) {
        this.$store.dispatch("loadModule", files.item(i).path);
      }
    },
  },
};
</script>

<style scoped>
* {
  text-transform: none !important;
}
.v-btn {
  margin-top: -5px;
}
</style>
<style>
html {
  overflow-y: hidden;
}
</style>

<!--
Copyright (C) 2019 Geode-solutions

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
    <v-navigation-drawer
      v-model="visible"
      stateless
      app
      clipped
      @transitionend="hide_drawer"
    >
      <v-row class="fill-height">
        <route-selector visible="visible" />
        <object-tree />
      </v-row>
    </v-navigation-drawer>
    <v-app-bar app dark clipped-left color="primary">
      <v-btn text class="pa-0" @click="visible = !visible">
        <v-app-bar-nav-icon>
          <v-icon large>
            $vuetify.icons.logo
          </v-icon>
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
          style="display:none;"
          @change="loadModule"
        />
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import RouteSelector from "@/components/RouteSelector";
import ObjectTree from "@/components/ObjectTree";
import vtkListenerHelper from "@/ListenerHelper";
import { mapState } from "vuex";
import { remote } from "electron";

export default {
  components: {
    RouteSelector,
    ObjectTree
  },
  data: () => ({
    visible: true
  }),
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.$store.dispatch(
      "loadConfigFile",
      remote.app.getPath("userData") + "/config.json"
    );

    this.renderListener = vtkListenerHelper.newInstance(
      () => {
        if (!this.loadingState) {
          this.proxyManager.autoAnimateViews();
        }
      },
      () =>
        [].concat(
          this.proxyManager.getSources(),
          this.proxyManager.getRepresentations(),
          this.proxyManager.getViews()
        )
    );
    this.pxmSub = this.proxyManager.onProxyRegistrationChange(
      this.renderListener.resetListeners
    );
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
    }
  }
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

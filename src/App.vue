<template>
  <v-app>
    <v-navigation-drawer permanent app clipped>
      <route-selector />
      <object-tree />
    </v-navigation-drawer>
    <v-toolbar dark app clipped-left color="primary">
      <v-toolbar-side-icon>
        <v-icon large>$vuetify.icons.logo</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>Geode-solutions</v-toolbar-title>
      <v-spacer></v-spacer>
      <load-file></load-file>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import LoadFile from "@/components/LoadFile";
import RouteSelector from "@/components/RouteSelector";
import ObjectTree from "@/components/ObjectTree";
import vtkListenerHelper from "@/ListenerHelper";
import { mapState } from "vuex";

export default {
  components: {
    LoadFile,
    RouteSelector,
    ObjectTree
  },
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.$store.dispatch(
      "load_module",
      "/home/camaud/programming/OpenGeode_node"
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
  }
};
</script>

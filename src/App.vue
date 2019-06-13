<template>
  <v-app>
    <v-navigation-drawer permanent app clipped>
      <object-tree></object-tree>
    </v-navigation-drawer>
    <v-toolbar app clipped-left color="primary">
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
import LoadFile from "@/components/LoadFile.vue";
import ObjectTree from "@/components/ObjectTree.vue";
import vtkListenerHelper from "@/ListenerHelper";
import { mapState } from "vuex";

export default {
  components: {
    LoadFile,
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

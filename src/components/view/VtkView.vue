<template>
  <v-container
    class="pa-0 ma-0"
    fluid
    style="height: 100%; background-color: grey;"
  >
    <view-toolbar :view="viewId" />
    <v-row v-resize="resizeCurrentView" no-gutters class="fill-height">
      <v-col
        ref="vtkView"
        style="
          overflow: hidden;
          height: calc(100vh - 64px);
          position: relative;
          z-index: 0;
        "
      />
    </v-row>
    <contextual-menu
      v-if="displayMenu"
      v-model="displayMenu"
      :selected-item="selectedItem"
      :position="menuPosition"
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import vtkRemoteView from "vtk.js/Sources/Rendering/Misc/RemoteView";
import ContextualMenu from "../ContextualMenu";
import ViewToolbar from "./ViewToolbar";

import macro from "vtk.js/Sources/macro";
import vtkInteractorObserver from "vtk.js/Sources/Rendering/Core/InteractorObserver";
import vtkViewProxy from "vtk.js/Sources/Proxy/Core/ViewProxy";
import vtkInteractiveOrientationWidget from "vtk.js/Sources/Widgets/Widgets3D/InteractiveOrientationWidget";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";
import vtkOrientationMarkerWidget from "vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget";
import { CaptureOn } from "vtk.js/Sources/Widgets/Core/WidgetManager/Constants";

export default {
  name: "VtkView",
  components: {
    ContextualMenu,
    ViewToolbar,
  },
  data: () => ({
    selectedItem: {},
    displayMenu: false,
    menuPosition: {},
    viewId: "-1",
  }),
  computed: {
    ...mapState("network", ["client"]),
    ...mapState("view", ["view", "widgetManager", "viewStream"]),
    ...mapGetters("treeview", ["selections"]),
    ...mapGetters({
      //showRenderingStats: 'PVL_VIEW_STATS',
      //stillQuality: 'PVL_VIEW_QUALITY_STILL',
      //interactiveQuality: 'PVL_VIEW_QUALITY_INTERACTIVE',
      //stillRatio: 'PVL_VIEW_RATIO_STILL',
      //interactiveRatio: 'PVL_VIEW_RATIO_INTERACTIVE',
      //mouseThrottle: 'PVL_VIEW_MOUSE_THROTTLE',
      //maxFPS: 'PVL_VIEW_FPS_MAX',
      //activeSources: 'PVL_PROXY_SELECTED_IDS',
    }),
  },
  mounted() {
    this.view.setContainer(this.$refs.vtkView);
    this.view.getOpenglRenderWindow().setViewStream(this.viewStream);
    this.widgetManager.setRenderer(this.view.getRenderer());
    this.resizeCurrentView();
  },
  beforeDestroy() {
    this.view.setContainer(null);
  },
  methods: {
    ...mapActions("network", ["call"]),
    resizeCurrentView() {
      if (this.view) {
        this.view.resize();
        this.view.renderLater();
        this.$store.dispatch("view/pushCamera");
      }
    },
  },
};
</script>

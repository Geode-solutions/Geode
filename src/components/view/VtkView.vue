<template>
  <v-container class="pa-0 ma-0" fluid style="height: 100%">
    <view-toolbar :view="viewId" />
    <v-row v-resize="resizeCurrentView" no-gutters class="fill-height">
      <v-col
        ref="vtkView"
        style="overflow: hidden; height: calc(100vh - 64px); position: relative; z-index: 0;"
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

export default {
  name: "VtkView",
  components: {
    ContextualMenu,
    ViewToolbar
  },
  data: () => ({
    selectedItem: {},
    displayMenu: false,
    menuPosition: {},
    viewId: "-1"
  }),
  computed: {
    ...mapState("network", ["client"]),
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
    })
  },
  mounted() {
    this.view = vtkRemoteView.newInstance();
    this.view.setRpcWheelEvent("opengeode.mouse.wheel");
    this.view.setContainer(this.$refs.vtkView);
    const session = this.client.getConnection().getSession();
    this.view.setSession(session);
    this.view.setViewId(this.viewId);

    this.view.getInteractorStyle().onRemoteMouseEvent(e => {
      if (e.buttonRight && e.action == "down") {
        const { width, height } = this.$refs.vtkView.getBoundingClientRect();
        const x = e.x * width;
        const y = e.y * height;
        this.call({
          command: "opengeode.mouse.menu",
          args: [x, y, this.selections]
        }).then(id => {
          if(id != 0)
          {
          const item = this.$store.getters.object(id);
          console.log("FOUND ", item.name);
          this.selectedItem = item;
          this.displayMenu = true;
          this.menuPosition = {
            x: this.left + x,
            y
          };
          }
        });
      }
    });
    this.left = this.$refs.vtkView.getBoundingClientRect().left;
    this.$root.$on("hide_drawer", this.resizeCurrentView);
  },
  beforeDestroy() {
    this.view.delete();
    this.view = null;
  },
  methods: {
    ...mapActions("network", ["call"]),
    resizeCurrentView() {
      if (this.view) {
        this.view.resize();
        this.view.render();
      }
    }
  }
};
</script>

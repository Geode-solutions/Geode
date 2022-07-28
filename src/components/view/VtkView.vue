<template>
  <v-row v-resize="resizeCurrentView" no-gutters class="fill-height">
    <view-toolbar :view="viewId" />
    <v-col
      ref="vtkViewJS"
      style="overflow: hidden; position: relative; z-index: 0"
    />
    <contextual-menu
      v-if="displayMenu"
      v-model="displayMenu"
      :selected-item="selectedItem"
      :position="menuPosition"
    />
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ContextualMenu from "../ContextualMenu";
import ViewToolbar from "./ViewToolbar";

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
    this.view.setContainer(this.$refs.vtkViewJS);
    this.view.getOpenglRenderWindow().setViewStream(this.viewStream);
    this.widgetManager.setRenderer(this.view.getRenderer());
    this.resizeCurrentView();

    this.view.getInteractor().onRightButtonPress((e) => {
      console.log(this.$refs.vtkViewJS);
      // const { width, height } = this.$refs.vtkViewJS.getBoundingClientRect();
      const x = e.position.x; // * width;
      const y = e.position.y; // * height;
      console.log("x/y", x, y);
      this.call({
        command: "geode.mouse.menu",
        args: [x, y, this.selections],
      }).then((id) => {
        if (id != 0) {
          const item = this.$store.getters.object(id);
          console.log("FOUND ", item.name);
          this.selectedItem = item;
          this.displayMenu = true;
          this.menuPosition = {
            x: this.left + x,
            y,
          };
        }
      });
    });
    this.left = this.$refs.vtkViewJS.getBoundingClientRect().left;
    this.$root.$on("hide_drawer", this.resizeCurrentView);
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
        this.$store.dispatch("view/pushMakerViewport");
      }
    },
  },
};
</script>

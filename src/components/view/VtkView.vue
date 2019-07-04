<template>
  <v-container pa-0 ma-0 fluid style="height: 100%">
    <view-toolbar :view="view" />
    <v-layout column fill-height>
      <v-flex
        ref="vtkView"
        d-flex
        style="z-index: 0; background: linear-gradient(#666, #999)"
        @click="view.activate()"
      />
      <status-bar />
    </v-layout>
    <contextual-menu :view="view" />
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import viewHelper from "@/config/viewHelper";
import StatusBar from "./StatusBar";
import ContextualMenu from "./ContextualMenu";
import ViewToolbar from "./ViewToolbar";

export default {
  name: "VtkView",
  components: {
    ContextualMenu,
    StatusBar,
    ViewToolbar
  },
  computed: {
    ...mapState(["proxyManager", "data"]),
    ...mapGetters({
      view: "view"
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.view) {
        this.view.setContainer(this.$refs.vtkView);
      }

      // Closure creation for callback
      this.resizeCurrentView = () => {
        if (this.view) {
          this.view.getOpenglRenderWindow().setSize(0, 0);
          this.view.resize();
        }
      };

      // Event handling
      window.addEventListener("resize", this.resizeCurrentView);

      // Capture event handler to release then at exit
      this.subscriptions = [
        () => window.removeEventListener("resize", this.resizeCurrentView),
        this.proxyManager.onProxyRegistrationChange(() => {
          // When proxy change, just re-render widget
          viewHelper.updateViewsAnnotation(this.proxyManager);
          this.$forceUpdate();
        }).unsubscribe,

        this.view.onModified(() => {
          this.$forceUpdate();
        }).unsubscribe,

        this.proxyManager.onActiveViewChange(() => {
          this.$forceUpdate();
        }).unsubscribe,

        this.proxyManager.onActiveSourceChange(() => {
          if (this.view.bindRepresentationToManipulator) {
            const activeSource = this.proxyManager.getActiveSource();
            const representation = this.view
              .getRepresentations()
              .find(r => r.getInput() === activeSource);
            this.view.bindRepresentationToManipulator(representation);
            this.view.updateWidthHeightAnnotation();
          }
        }).unsubscribe
      ];

      // Initial setup
      this.resizeCurrentView();
    });
  },
  beforeDestroy() {
    if (this.view) {
      this.view.setContainer(null);
    }
    while (this.subscriptions.length) {
      this.subscriptions.pop()();
    }
  }
};
</script>

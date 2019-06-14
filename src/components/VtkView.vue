<template>
  <v-container pa-0 ma-0 fluid style="height: 100%">
    <v-layout column :class="$style.floatToolbar">
      <v-tooltip left>
        Reset camera
        <v-btn slot="activator" icon dark small @click="resetCamera()">
          <v-icon>filter_center_focus</v-icon>
        </v-btn>
      </v-tooltip>
    </v-layout>
    <v-layout column fill-height>
      <v-flex
        d-flex
        style="z-index: 0; background: linear-gradient(#666, #999)"
        class="vtkView"
        @click="view.activate()"
      />
      <status-bar />
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import viewHelper from "@/config/viewHelper";
import StatusBar from "./StatusBar.vue";

export default {
  name: "VtkView",
  components: {
    StatusBar
  },
  computed: {
    ...mapState(["proxyManager"]),
    ...mapGetters({
      view: "view"
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.view) {
        this.view.setContainer(this.$el.querySelector(".vtkView"));
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
  },
  methods: {
    resetCamera() {
      if (this.view) {
        this.view.resetCamera();
        this.resizeCurrentView();
      }
    }
  }
};
</script>

<style module>
.floatToolbar {
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
}
</style>

<template>
<v-container fluid>
  <v-layout column fill-height>
    <v-flex
      fill-height
      class="vtkView js-view"
      v-on:click="view.activate()"
    />
    <div
      class="activeview"
      v-if="proxyManager.getActiveView() === view"
    />
  </v-layout>
</v-container>
</template>

<script>
import viewHelper from "@/config/viewHelper";

export default {
  name: "VtkView",
  computed: {
    proxyManager() {
      return this.$store.state.proxyManager;
    },
    view() {
      return this.$store.getters["view"];
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.view) {
        this.view.setContainer(this.$el.querySelector(".js-view"));
      }

      // Closure creation for callback
      this.resizeCurrentView = () => {
        if (this.view) {
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
      this.initialSubscriptionLength = this.subscriptions.length;

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

<style scoped>
.container {
  position: relative;
  height: 100%;
  padding: 0;
  margin: 0;
}
.vtkView {
  position: relative;
  z-index: 0;
  overflow: hidden;
}
.activeView {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 8px;
  height: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 51%
  );
}
</style>

<template>
  <v-layout column :class="$style.floatToolbar">
    <v-tooltip left>
      Settings
      <template #activator="{ on }">
        <v-btn icon dark small v-on="on" @click="settings = !settings">
          <v-icon>fas fa-cog</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
    <view-settings v-if="settings" />
    <v-tooltip left>
      Reset camera
      <template #activator="{ on }">
        <v-btn icon dark small v-on="on" @click="resetCamera()">
          <v-icon>fas fa-expand</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
    <v-tooltip left>
      Center camera
      <template #activator="{ on }">
        <v-btn icon dark small v-on="on" @click="centerCamera()">
          <v-icon>fas fa-compress-arrows-alt</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
    <v-speed-dial direction="left">
      <template #activator>
        <v-tooltip left>
          Clipping
          <template #activator="{ on }">
            <v-btn icon dark small v-on="on">
              <v-icon>fas fa-crop-alt</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-btn fab dark small color="primary" @click="clipping = !clipping">
        <v-icon v-if="clipping">
          fas fa-toggle-on
        </v-icon>
        <v-icon v-else>
          fas fa-toggle-off
        </v-icon>
      </v-btn>
    </v-speed-dial>
  </v-layout>
</template>

<script>
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";
import vtkImplicitPlaneWidget from "vtk.js/Sources/Widgets/Widgets3D/ImplicitPlaneWidget";
import ViewSettings from "./ViewSettings";

export default {
  name: "ViewToolbar",
  components: {
    ViewSettings
  },
  props: {
    view: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    settings: false,
    centering: false,
    clipping: false
  }),
  watch: {
    clipping: function(value) {
      const widgetManager = this.view.getReferenceByName("widgetManager");
      if (value) {
        widgetManager.enablePicking();
        console.log(widgetManager.addWidget(this.clipper));
      } else {
        widgetManager.removeWidget(this.clipper);
        widgetManager.disablePicking();
      }
      this.view.renderLater();
    }
  },
  mounted() {
    this.$nextTick(() => {
      const widgetManager = this.view.getReferenceByName("widgetManager");
      widgetManager.setRenderer(this.view.getRenderer());
      this.clipper = vtkImplicitPlaneWidget.newInstance();
      this.clipper.getWidgetState().setNormal(0, 0, 1);
      console.log(this.clipper);
      console.log(widgetManager);
      //widget.placeWidget(cone.getOutputData().getBounds());

      this.view
        .getRenderWindow()
        .getInteractor()
        .onLeftButtonPress(callData => {
          const renderer = this.view.getRenderer();
          if (!this.centering || renderer !== callData.pokedRenderer) {
            return;
          }
          const picker = vtkPicker.newInstance();
          picker.pick(
            [callData.position.x, callData.position.y, 0.0],
            renderer
          );
          this.view.focusTo(...picker.getPickPosition());
          this.view.getOpenglRenderWindow().setCursor("pointer");
          this.centering = false;
        });
    });
  },
  methods: {
    resetCamera() {
      if (this.view) {
        this.view.resetCamera();
      }
    },
    centerCamera() {
      if (this.view) {
        this.view.getOpenglRenderWindow().setCursor("default");
        this.centering = true;
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

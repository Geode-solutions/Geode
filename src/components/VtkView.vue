<template>
  <v-container pa-0 ma-0 fluid style="height: 100%">
    <v-layout column :class="$style.floatToolbar">
      <v-tooltip left>
        Reset camera
        <v-btn slot="activator" icon dark small @click="resetCamera()">
          <v-icon>fas fa-expand</v-icon>
        </v-btn>
      </v-tooltip>
      <v-tooltip left>
        Center camera
        <v-btn slot="activator" icon dark small @click="centerCamera()">
          <v-icon>fas fa-compress-arrows-alt</v-icon>
        </v-btn>
      </v-tooltip>
      <v-speed-dial direction="left">
        <template v-slot:activator>
          <v-tooltip left>
            Clipping
            <v-btn slot="activator" icon dark small>
              <v-icon>fas fa-crop-alt</v-icon>
            </v-btn>
          </v-tooltip>
        </template>
        <v-btn fab dark small color="primary" @click="clipping = !clipping">
          <v-icon v-if="clipping">fas fa-toggle-on</v-icon>
          <v-icon v-else>fas fa-toggle-off</v-icon>
        </v-btn>
      </v-speed-dial>
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
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";
import vtkImplicitPlaneWidget from "vtk.js/Sources/Widgets/Widgets3D/ImplicitPlaneWidget";

export default {
  name: "VtkView",
  components: {
    StatusBar
  },
  data() {
    return {
      centering: false,
      clipping: false
    };
  },
  computed: {
    ...mapState(["proxyManager"]),
    ...mapGetters({
      view: "view"
    })
  },
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
      if (this.view) {
        this.view.setContainer(this.$el.querySelector(".vtkView"));

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
            const pickedPoint = picker.getPickPosition();
            const pickedPoint2 = picker.getPickedPositions();
            console.log(pickedPoint);
            console.log(pickedPoint2);

            renderer
              .getActiveCamera()
              .setFocalPoint(pickedPoint[0], pickedPoint[1], pickedPoint[2]);
            this.view
              .getInteractorStyle2D()
              .setCenterOfRotation(
                pickedPoint[0],
                pickedPoint[1],
                pickedPoint[2]
              );
            this.view
              .getInteractorStyle3D()
              .setCenterOfRotation(
                pickedPoint[0],
                pickedPoint[1],
                pickedPoint[2]
              );

            this.view.getOpenglRenderWindow().setCursor("pointer");
            this.centering = false;
          });
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

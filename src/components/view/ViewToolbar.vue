<template>
  <v-row dense :class="[$style.floatToolbar, 'flex-column']">
    <v-col>
      <v-tooltip left>
        Settings
        <template #activator="{ on }">
          <v-btn icon dark small v-on="on" @click="settings = !settings">
            <v-icon>fas fa-cog</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <view-settings v-if="settings" />
    </v-col>
    <v-col>
      <v-tooltip left>
        Reset camera
        <template #activator="{ on }">
          <v-btn icon dark small v-on="on" @click="resetCamera()">
            <v-icon>fas fa-expand</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-tooltip left>
        Center camera
        <template #activator="{ on }">
          <v-btn icon dark small v-on="on" @click="centerCamera()">
            <v-icon>fas fa-compress-arrows-alt</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";
import { mapGetters, mapState } from "vuex";
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
    centering: false
  }),
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.$nextTick(() => {
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
  right: 20px;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
}
</style>

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
      <view-settings v-if="settings" :view="view" />
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
    <!-- <v-col>
      <v-tooltip left>
        Distance
        <template #activator="{ on }">
          <v-btn
            icon
            dark
            small
            :class="distanceStyle"
            v-on="on"
            @click="pickDistance()"
          >
            <v-icon>fas fa-ruler</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
    <v-snackbar v-model="distanceVisible" :timeout="timeout">
      Distance = {{ distanceValue }}
    </v-snackbar> -->
  </v-row>
</template>

<script>
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";
import vtkDistanceWidget from "vtk.js/Sources/Widgets/Widgets3D/DistanceWidget";
import vtkBoundingBox from "vtk.js/Sources/Common/DataModel/BoundingBox";
import { mapState } from "vuex";
import ViewSettings from "./ViewSettings";

export default {
  name: "ViewToolbar",
  components: {
    ViewSettings
  },
  props: {
    view: {
      required: true,
      type: String
    }
  },
  data: () => ({
    timeout: 0,
    settings: false,
    centering: false,
    distanceWidget: {},
    distanceVisible: false,
    distanceValue: 0
  }),
  computed: {
    ...mapState(["proxyManager"]),
    ...mapState("network", ["client"]),
    distanceStyle() {
      return this.distanceVisible ? "teal" : "";
    }
  },
  methods: {
    resetCamera() {
      this.client.getRemote().ViewPort.resetCamera(this.view);
    },
    centerCamera() {
      this.view.getOpenglRenderWindow().setCursor("default");
      this.centering = true;
    },
    pickDistance() {
      this.distanceVisible = !this.distanceVisible;
      const widgetManager = this.view.getReferenceByName("widgetManager");
      if (this.distanceVisible) {
        const box = vtkBoundingBox.newInstance();
        for (let [key, value] of Object.entries(
          this.proxyManager.getReferenceByName("r2svMapping")
        )) {
          if (value.viewId === this.view.getProxyId()) {
            box.addBox(this.proxyManager.getProxyById(key));
          }
        }
        this.distanceWidget = vtkDistanceWidget.newInstance();
        this.distanceWidget.placeWidget(box.getBounds());
        widgetManager.addWidget(this.distanceWidget);
        widgetManager.enablePicking();
        widgetManager.grabFocus(this.distanceWidget);
        this.distanceWidget.getWidgetState().onModified(() => {
          this.distanceValue = this.distanceWidget.getDistance();
        });
      } else {
        widgetManager.removeWidget(this.distanceWidget);
        widgetManager.disablePicking();
      }
      this.view.modified();
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
.teal {
  background-color: var(--v-primary-base);
}
</style>

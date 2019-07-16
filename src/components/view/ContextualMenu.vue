<template>
  <div>
    <div v-if="display">
      <div :class="[$style.disk, $style.outerDisk, 'ring', 'elevation-10']" :style="diskStyle">
        <v-tooltip v-for="(item, index) in contextualItems" :key="index" bottom>
          {{ item.tooltip }}
          <template #activator="{ on }">
            <v-btn
              icon
              absolute
              :style="{
                left: item.left,
                top: item.top,
                width: btnSize + 'px',
                height: btnSize + 'px'
              }"
              @click="selectItem(item, index)"
              v-on="on"
            >
              <v-icon large>{{ item.icon }}</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
      <div
        :class="[$style.disk, $style.innerDisk]"
        :style="innerDiskStyle"
      ></div>
    </div>

    <template v-for="(item, index) in contextualItems">
      <component
        :is="item.component"
        v-if="displayComponents[index]"
        :key="index"
        :visible.sync="displayComponents[index]"
        :item="selectedItem"
      />
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";

export default {
  name: "ContextualMenu",
  props: {
    view: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      display: false,
      width: 300,
      ringWidth: 80,
      diskStyle: {
        width: "",
        height: "",
        borderWidth: "",
        bottom: "",
        left: ""
      },
      innerDiskStyle: {
        width: "",
        height: "",
        borderWidth: "",
        bottom: "",
        left: ""
      },
      displayComponents: [],
      selectedItem: "",
      displayComponent: false
    };
  },
  computed: {
    ...mapState(["proxyManager", "data"]),
    ...mapState("ui", ["contextualItems"]),
    radius() {
      return this.width / 2;
    },
    innerRadius() {
      return this.innerWidth / 2;
    },
    innerWidth() {
      return this.width - 2 * this.ringWidth;
    },
    btnSize() {
      return (3 * this.ringWidth) / 4;
    }
  },
  watch: {
    contextualItems: function(value) {
      const size = value.length;
      while (this.displayComponents.length > size) {
        this.displayComponents.pop();
      }
      while (this.displayComponents.length < size) {
        this.displayComponents.push(false);
      }
    }
  },
  mounted() {
    this.diskStyle.width = this.width + "px";
    this.diskStyle.height = this.width + "px";
    this.diskStyle.borderWidth = this.ringWidth + "px";
    this.innerDiskStyle.width = this.innerWidth + "px";
    this.innerDiskStyle.height = this.innerWidth + "px";
    this.innerDiskStyle.borderWidth = this.innerRadius + "px";
    this.$nextTick(() => {
      this.view
        .getRenderWindow()
        .getInteractor()
        .onRightButtonPress(callData => {
          const renderer = this.view.getRenderer();
          if (renderer !== callData.pokedRenderer) {
            return;
          }
          const picker = vtkPicker.newInstance();
          picker.pick(
            [callData.position.x, callData.position.y, 0.0],
            renderer
          );
          picker.getActors().forEach(actor => {
            const rep = this.proxyManager
              .getRepresentations()
              .filter(r => r.getActors()[0] === actor);
            const sourceID = this.proxyManager.getReferenceByName(
              "r2svMapping"
            )[rep[0].getProxyId()].sourceId;
            this.data.forEach(item => {
              if (item.source.getProxyId() == sourceID) {
                console.log("FOUND ", item.name);
                this.selectedItem = item;
                this.display = true;
                this.diskStyle.left = callData.position.x - this.radius + "px";
                this.diskStyle.bottom =
                  callData.position.y - this.radius + "px";
                this.innerDiskStyle.left =
                  callData.position.x - this.innerRadius + "px";
                this.innerDiskStyle.bottom =
                  callData.position.y - this.innerRadius + "px";
                document
                  .querySelector("[data-app]")
                  .addEventListener("mousedown", this.onClickOutside, true);

                const frags = 360 / this.contextualItems.length;
                const angles = this.contextualItems.map(
                  (item, index) => (frags * index * Math.PI) / 180
                );
                this.contextualItems.forEach((item, index) => {
                  item.left =
                    this.innerRadius +
                    (Math.cos(angles[index]) *
                      (this.innerRadius + this.radius)) /
                      2 -
                    this.btnSize / 2 +
                    "px";
                  item.top =
                    this.innerRadius -
                    (Math.sin(angles[index]) *
                      (this.innerRadius + this.radius)) /
                      2 -
                    this.btnSize / 2 +
                    "px";
                });
              }
            });
          });
        });
    });
  },
  methods: {
    onClickOutside(event) {
      const ring = document.querySelector(".ring");
      if (ring && !ring.contains(event.target)) {
        this.closeRing();
      }
    },
    closeRing() {
      this.display = false;
      document
        .querySelector("[data-app]")
        .removeEventListener("mousedown", this.onClickOutside, true);
    },
    selectItem(item, index) {
      console.log(item.component);
      this.closeRing();
      this.displayComponents[index] = true;
    }
  }
};
</script>

<style module>
.disk {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
}
.outerDisk {
  border-color: var(--v-primary-base);
}
.innerDisk {
  opacity: 0;
}
</style>

<template>
  <v-container class="pa-0 ma-0" fluid style="height: 100%">
    <view-toolbar :view="view" />
    <v-row no-gutters class="fill-height">
      <v-col
        ref="vtkView"
        :style="{ 'z-index': '0', background: vtkBackground }"
        @click="view.activate()"
      />
    </v-row>
    <contextual-menu v-if="displayMenu" :selected-item="selectedItem" :position="menuPosition" />
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";
import viewHelper from "@/config/viewHelper";
import ContextualMenu from "./ContextualMenu";
import ViewToolbar from "./ViewToolbar";

function checkSourceId(source, sourceID) {
  if (source.isA) {
    return source.getProxyId() == sourceID;
  } else {
    let result = false;
    Object.keys(source).forEach(key => {
      source[key].forEach(item => {
        if (item.isA && item.getProxyId() == sourceID) {
          result = true;
        }
      });
    });
    return result;
  }
}

export default {
  name: "VtkView",
  components: {
    ContextualMenu,
    ViewToolbar
  },
  data: () => ({
    selectedItem: "",
    displayMenu: false,
    menuPosition: {}
  }),
  computed: {
    ...mapState(["proxyManager", "data", "vtkBackground"]),
    ...mapGetters({
      view: "view"
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.view.setContainer(this.$refs.vtkView);
      this.configContextualMenu();

      window.addEventListener("resize", this.resizeCurrentView);
      this.$root.$on("hide_drawer", this.resizeCurrentView);

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

      this.resizeCurrentView();
    });
  },
  beforeDestroy() {
    this.view.setContainer(null);
    while (this.subscriptions.length) {
      this.subscriptions.pop()();
    }
  },
  methods: {
    configContextualMenu() {
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
              console.log(item.source);
              if (checkSourceId(item.source, sourceID)) {
                console.log("FOUND ", item.name);
                this.selectedItem = item;
                this.displayMenu = true;
                this.menuPosition = callData.position;
              }
            });
          });
        });      
    },
    resizeCurrentView() {
      this.view.getOpenglRenderWindow().setSize(0, 0);
      this.view.resize();
    },
    viewClick() {
      if (this.displayMenu) {
        this.displayMenu = false;
      }
    }
  }
};
</script>

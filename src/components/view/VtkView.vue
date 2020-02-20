<template>
  <v-container class="pa-0 ma-0" fluid style="height: 100%">
    <view-toolbar :view="viewId" />
    <v-row v-resize="resizeCurrentView" no-gutters class="fill-height">
      <v-col
        ref="vtkView"
        style="overflow: hidden; height: calc(100vh - 64px); position: relative; z-index: 0;"
      />
    </v-row>
    <contextual-menu
      v-if="displayMenu"
      v-model="displayMenu"
      :selected-item="selectedItem"
      :position="menuPosition"
      :views="[view]"
    />
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import vtkPicker from "vtk.js/Sources/Rendering/Core/Picker";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";
import vtkRemoteView from "vtk.js/Sources/Rendering/Misc/RemoteView";
// import viewHelper from "@/config/viewHelper";
import vtkOrientationMarkerWidget from "vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget";
import ContextualMenu from "../ContextualMenu";
import ViewToolbar from "./ViewToolbar";
import NorthActor from "@/config/northActor";

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
    selectedItem: {},
    displayMenu: false,
    menuPosition: {},
    left: 0,
    viewId: "0"
  }),
  computed: {
    ...mapState(["proxyManager", "data", "vtkBackground"]),
    ...mapState("network", ["client"]),
    ...mapGetters({
      //showRenderingStats: 'PVL_VIEW_STATS',
      //stillQuality: 'PVL_VIEW_QUALITY_STILL',
      //interactiveQuality: 'PVL_VIEW_QUALITY_INTERACTIVE',
      //stillRatio: 'PVL_VIEW_RATIO_STILL',
      //interactiveRatio: 'PVL_VIEW_RATIO_INTERACTIVE',
      //mouseThrottle: 'PVL_VIEW_MOUSE_THROTTLE',
      //maxFPS: 'PVL_VIEW_FPS_MAX',
      //activeSources: 'PVL_PROXY_SELECTED_IDS',
    })
  },
  mounted() {
    this.view = vtkRemoteView.newInstance();
    this.view.setRpcWheelEvent("opengeode.mouse.wheel");
    this.view.setContainer(this.$refs.vtkView);
    const session = this.client.getConnection().getSession();
    this.view.setSession(session);
    this.view.setViewId(this.viewId);
    // this.orientationWidget = vtkOrientationMarkerWidget.newInstance({
    //   actor: NorthActor.newInstance(),
    //   interactor: this.view.getInteractor()
    // });
    // this.orientationWidget.setEnabled(true);
    // this.orientationWidget.setViewportCorner(
    //   vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT
    // );
    // this.orientationWidget.setViewportSize(0.1);
    // this.orientationWidget.updateMarkerOrientation();
    
    // this.view.getInteractorStyle().onRemoteMouseEvent(e => {
    //   console.log("click", e);
    //   if (session && e.buttonRight && e.action == "down") {
    //     session
    //       .call("geode.mouse.menu", [e])
    //       .then(result => console.log(result));
    //   }
    // });
    /*
    this.left = this.$refs.vtkView.getBoundingClientRect().left;
    this.configContextualMenu();

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

    // const widgetManager = this.view.getReferenceByName("widgetManager");
    // if (widgetManager) {
    // const enabled = widgetManager.getPickingEnabled();
    // widgetManager.setRenderer(this.view.getRenderer());
    // workaround to disable picking if previously disabled
    // if (!enabled) {
    // widgetManager.disablePicking();
    // }
    // }
    // });*/
  },
  beforeDestroy() {
    this.view.delete();
    this.view = null;
    // while (this.subscriptions.length) {
    //   this.subscriptions.pop()();
    // }
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
                this.menuPosition = {
                  x: this.left + callData.position.x,
                  y: callData.position.y
                };
              }
            });
          });
        });
    },
    resizeCurrentView() {
      if (this.view) {
        this.view.resize();
        this.view.render();
      }
    }
  }
};
</script>

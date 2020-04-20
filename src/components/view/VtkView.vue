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
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import vtkRemoteView from "vtk.js/Sources/Rendering/Misc/RemoteView";
import ContextualMenu from "../ContextualMenu";
import ViewToolbar from "./ViewToolbar";

import macro from "vtk.js/Sources/macro";
import vtkInteractorObserver from "vtk.js/Sources/Rendering/Core/InteractorObserver";
import vtkViewProxy from "vtk.js/Sources/Proxy/Core/ViewProxy";
import vtkInteractiveOrientationWidget from "vtk.js/Sources/Widgets/Widgets3D/InteractiveOrientationWidget";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";
import vtkOrientationMarkerWidget from "vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget";
import { CaptureOn } from "vtk.js/Sources/Widgets/Core/WidgetManager/Constants";

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
    viewId: "-1"
  }),
  computed: {
    ...mapState("network", ["client"]),
    ...mapGetters("treeview", ["selections"]),
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
    // this.view = vtkRemoteView.newInstance();
    // this.view.setRpcWheelEvent("opengeode.mouse.wheel");
    // this.view.setContainer(this.$refs.vtkView);
    // const session = this.client.getConnection().getSession();
    // this.view.setSession(session);
    // this.view.setViewId(this.viewId);





    this.view = vtkViewProxy.newInstance();
    this.view.setContainer(this.$refs.vtkView);
    this.view.resize();

    // Create and link viewStream
    this.viewStream = this.client.getImageStream().createViewStream(this.viewId);
    this.view.getOpenglRenderWindow().setViewStream(this.viewStream);
    this.view.setBackground([0, 0, 0, 0]);
    this.camera = this.view.getCamera();
    this.viewStream.setCamera(this.camera);

    // Bind user input
    const interactor = this.view.getRenderWindow().getInteractor();
    interactor.onStartAnimation(this.viewStream.startInteraction);
    interactor.onEndAnimation(this.viewStream.endInteraction);
    // this.mousePositionCache = vtkCacheMousePosition.newInstance();
    // this.mousePositionCache.setInteractor(interactor);

    // Add orientation widget
    const orientationWidget = this.view.getReferenceByName("orientationWidget");
    this.widgetManager = vtkWidgetManager.newInstance();
    this.widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);
    this.widgetManager.setRenderer(orientationWidget.getRenderer());
    orientationWidget.setViewportCorner(
      vtkOrientationMarkerWidget.Corners.TOP_LEFT
    );

    const bounds = [-0.51, 0.51, -0.51, 0.51, -0.51, 0.51];
    this.widget = vtkInteractiveOrientationWidget.newInstance();
    this.widget.placeWidget(bounds);
    this.widget.setBounds(bounds);
    this.widget.setPlaceFactor(1);
    this.widget.getWidgetState().onModified(() => {
      const state = this.widget.getWidgetState();
      if (!state.getActive()) {
        this.orientationTooltip = "";
        return;
      }
      const direction = state.getDirection();
      const { axis, orientation, viewUp } = computeOrientation(
        direction,
        this.camera.getViewUp()
      );
      this.orientationTooltip = `Reset camera ${orientation > 0 ? "+" : "-"}${
        "XYZ"[axis]
      }/${vectorToLabel(viewUp)}`;
      // this.tooltipStyle = toStyle(
      //   this.mousePositionCache.getPosition(),
      //   this.view.getOpenglRenderWindow().getSize()[1]
      // );
    });

    // Manage user interaction
    this.viewWidget = this.widgetManager.addWidget(this.widget);
    this.viewWidget.onOrientationChange(({ direction }) => {
      this.updateOrientation(
        computeOrientation(direction, this.camera.getViewUp())
      );
    });

    // Initial config
    // this.updateQuality();
    // this.updateRatio();
    this.client.getImageStream().setServerAnimationFPS(this.maxFPS);

    // Expose viewProxy to store (for camera update...)
    // this.$store.commit("PVL_VIEW_PVL_PROXY_SET", this.view);

    // Link server side camera to local
    // this.client.remote.Lite.getCamera(this.viewId).then(cameraInfo => {
    //   this.updateCamera(cameraInfo);
    //   this.viewStream.pushCamera();
    // });









    // this.view.getInteractorStyle().onRemoteMouseEvent(e => {
    //   if (e.buttonRight && e.action == "down") {
    //     const { width, height } = this.$refs.vtkView.getBoundingClientRect();
    //     const x = e.x * width;
    //     const y = e.y * height;
    //     this.call({
    //       command: "opengeode.mouse.menu",
    //       args: [x, y, this.selections]
    //     }).then(id => {
    //       if(id != 0)
    //       {
    //       const item = this.$store.getters.object(id);
    //       console.log("FOUND ", item.name);
    //       this.selectedItem = item;
    //       this.displayMenu = true;
    //       this.menuPosition = {
    //         x: this.left + x,
    //         y
    //       };
    //       }
    //     });
    //   }
    // });
    // this.left = this.$refs.vtkView.getBoundingClientRect().left;
    // this.$root.$on("hide_drawer", this.resizeCurrentView);
  },
  beforeDestroy() {
    this.view.delete();
    this.view = null;
  },
  methods: {
    ...mapActions("network", ["call"]),
    resizeCurrentView() {
      if (this.view) {
        this.view.resize();
        this.view.render();
      }
    }
  }
};
</script>

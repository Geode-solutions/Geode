/*
 * Copyright (C) 2019 Geode-solutions
 *
 * This file is a part of Geode library.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 */

import vtkXMLPolyDataReader from "vtk.js/Sources/IO/XML/XMLPolyDataReader";
import vtkView from "vtk.js/Sources/Proxy/Core/ViewProxy";
import vtkSource from "vtk.js/Sources/Proxy/Core/SourceProxy";
import vtkGeometryRepresentation from "vtk.js/Sources/Proxy/Representations/GeometryRepresentationProxy";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";

import { CaptureOn } from "vtk.js/Sources/Widgets/Core/WidgetManager/Constants";

export default {
  namespaced: true,
  state: {
    view: {},
    widgetManager: {}
  },
  getters: {
    items: state => state.tree.filter(item => item.children.length),
    selections: (state, getters, rootState, rootGetters) =>
      state.selectedTree.filter(item => rootGetters.object(item))
  },
  mutations: {
    registerView(state, view) {
      state.view = view;
    },
    registerWidgetManager(state, widgetManager) {
      state.widgetManager = widgetManager;
    }
  },
  actions: {
    createView({ commit }, { client, viewId }) {
      let view = vtkView.newInstance();
      // view.setContainer(state.$refs.vtkView);
      // view.resize();

      console.log( view );
      console.log( client );
      // Create and link viewStream
      // let viewStream = client.getImageStream().createViewStream(viewId);
      // console.log( viewStream );
      // console.log( view.getOpenglRenderWindow() );
      // view.getOpenglRenderWindow().setViewStream(viewStream);
      view.setBackground([0, 0, 0, 0]);
      // viewStream.setCamera(view.getCamera());

      // Bind user input
      const interactor = view.getRenderWindow().getInteractor();
      // interactor.onStartAnimation(viewStream.startInteraction);
      // interactor.onEndAnimation(viewStream.endInteraction);
      // state.mousePositionCache = vtkCacheMousePosition.newInstance();
      // state.mousePositionCache.setInteractor(interactor);
      console.log("interactor", interactor.getClassName(), interactor);
      interactor.onLeftButtonPress(e => console.log("3PRESS=====", e));
      interactor.onLeftButtonRelease(e => console.log("3RELEASE=====", e));

      // Add orientation widget
      // const orientationWidget = view.getReferenceByName("orientationWidget");
      let widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);
      // widgetManager.setRenderer(orientationWidget.getRenderer());
      // orientationWidget.setViewportCorner(
      //   vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT
      // );

      // const bounds = [-0.51, 0.51, -0.51, 0.51, -0.51, 0.51];
      // let widget = vtkInteractiveOrientationWidget.newInstance();
      // widget.placeWidget(bounds);
      // widget.setBounds(bounds);
      // widget.setPlaceFactor(1);
      // widget.getWidgetState().onModified(() => {
      //   const state = widget.getWidgetState();
      //   if (!state.getActive()) {
      //     state.orientationTooltip = "";
      //     return;
      //   }
      //   const direction = state.getDirection();
      //   const { axis, orientation, viewUp } = computeOrientation(
      //     direction,
      //     state.camera.getViewUp()
      //   );
      //   state.orientationTooltip = `Reset camera ${
      //     orientation > 0 ? "+" : "-"
      //   }${"XYZ"[axis]}/${vectorToLabel(viewUp)}`;
      //   // state.tooltipStyle = toStyle(
      //   //   state.mousePositionCache.getPosition(),
      //   //   view.getOpenglRenderWindow().getSize()[1]
      //   // );
      // });

      // Manage user interaction
      // let viewWidget = widgetManager.addWidget(widget);
      // viewWidget.onOrientationChange(({ direction }) => {
      //   state.updateOrientation(
      //     computeOrientation(direction, view.getCamera().getViewUp())
      //   );
      // });

      // Initial config
      // state.updateQuality();
      // state.updateRatio();
      // client.getImageStream().setServerAnimationFPS(state.maxFPS);

      // Expose viewProxy to store (for camera update...)
      // state.$store.commit("PVL_VIEW_PVL_PROXY_SET", view);

      // Link server side camera to local
      // state.client.remote.Lite.getCamera(viewId).then(cameraInfo => {
      //   state.updateCamera(cameraInfo);
      //   viewStream.pushCamera();
      // });
      commit("registerView", view);
      commit("registerWidgetManager", widgetManager);
    },
    createLocalObject({ state }, data) {
      console.log(data);
      let reader = vtkXMLPolyDataReader.newInstance();
      const textEncoder = new TextEncoder();
      reader.parseAsArrayBuffer(textEncoder.encode(data));
      let polydata = reader.getOutputData();
      console.log(polydata.getNumberOfLines());
      let source = vtkSource.newInstance();
      source.setInputData(polydata);
      let rep = vtkGeometryRepresentation.newInstance();
      rep.setInput(source);
      state.view.addRepresentation(rep);
      return { data: polydata, source, rep };
    }
  }
};

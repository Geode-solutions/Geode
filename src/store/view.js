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
import vtkNorthActor from "@/config/northActor";
import vtkOrientationMarkerWidget from 'vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget';

import { CaptureOn } from "vtk.js/Sources/Widgets/Core/WidgetManager/Constants";

export default {
  namespaced: true,
  state: {
    view: {},
    widgetManager: {},
    viewStream: {},
    viewId: "",
  },
  getters: {
    items: (state) => state.tree.filter((item) => item.children.length),
    selections: (state, getters, rootState, rootGetters) =>
      state.selectedTree.filter((item) => rootGetters.object(item)),
  },
  mutations: {
    registerView(state, view) {
      state.view = view;
    },
    registerViewId(state, viewId) {
      state.viewId = viewId;
    },
    registerWidgetManager(state, widgetManager) {
      state.widgetManager = widgetManager;
    },
    registerViewStream(state, viewStream) {
      state.viewStream = viewStream;
    },
  },
  actions: {
    pushCamera({ state, dispatch }) {
      const camera = state.view.getCamera();
      dispatch(
        "network/call",
        {
          command: "opengeode.camera.update",
          args: [
            state.viewId,
            camera.getFocalPoint(),
            camera.getViewUp(),
            camera.getPosition(),
            camera.getViewAngle(),
            camera.getClippingRange(),
          ],
        },
        { root: true }
      );
    },
    createView({ commit, dispatch }, { client, viewId }) {
      const view = vtkView.newInstance();
      console.log(view);
      console.log(view.listPropertyNames());
      const viewStream = client.getImageStream().createViewStream(viewId);
      viewStream.onImageReady((e) => {
        const glwindow = view.getOpenglRenderWindow();
        glwindow.setUseBackgroundImage(true);
        glwindow.setUseOffScreen(true);
      });

      const north = vtkNorthActor.newInstance();
      view.registerOrientationAxis("north", north);
      view.setOrientationAxesType("north");

      const interactor = view.getRenderWindow().getInteractor();

      // let orientationWidget = vtkOrientationMarkerWidget.newInstance({
      //   actor: north,
      //   interactor,
      // });
      // orientationWidget.setEnabled(true);
      // orientationWidget.setViewportCorner(
      //   vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT
      // );
      // orientationWidget.setViewportSize(0.1);

      console.log("interactor", interactor.getClassName(), interactor);
      interactor.onLeftButtonPress((e) => {
        console.log("3PRESS=====", e);
        const glwindow = view.getOpenglRenderWindow();
        glwindow.setUseBackgroundImage(false);
        glwindow.setUseOffScreen(false);
      });
      interactor.onLeftButtonRelease((e) => {
        console.log("3RELEASE=====", e);
        dispatch("pushCamera");
        console.log("PUSH");
      });
      interactor.onEndMouseWheel((e) => {
        console.log("3WHEEL=====", e);
        dispatch("pushCamera");
      });

      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);
      commit("registerView", view);
      commit("registerViewId", viewId);
      commit("registerWidgetManager", widgetManager);
      commit("registerViewStream", viewStream);

      dispatch("pushCamera");
    },
    createLocalObject({ state }, data) {
      const reader = vtkXMLPolyDataReader.newInstance();
      const textEncoder = new TextEncoder();
      reader.parseAsArrayBuffer(textEncoder.encode(data));
      const polydata = reader.getOutputData();
      const source = vtkSource.newInstance();
      source.setInputData(polydata);
      const rep = vtkGeometryRepresentation.newInstance();
      rep.setInput(source);
      rep.setColor([0, 150 / 255, 136 / 255]);
      state.view.addRepresentation(rep);
      return { data: polydata, source, rep };
    },
  },
};

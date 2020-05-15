/*
 * Copyright (C) 2019 - 2020 Geode-solutions
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
import vtkXMLPolyDataWriter from "vtk.js/Sources/IO/XML/XMLPolyDataWriter";
import vtkView from "vtk.js/Sources/Proxy/Core/ViewProxy";
import vtkSource from "vtk.js/Sources/Proxy/Core/SourceProxy";
import vtkGeometryRepresentation from "vtk.js/Sources/Proxy/Representations/GeometryRepresentationProxy";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";
import vtkNorthActor from "@/config/northActor";

import { CaptureOn } from "vtk.js/Sources/Widgets/Core/WidgetManager/Constants";

export default {
  namespaced: true,
  state: {
    view: {},
    widgetManager: {},
    viewStream: {},
    viewId: "",
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
    addRepresentation(state, rep) {
      state.view.addRepresentation(rep);
    },
    removeRepresentation(state, rep) {
      state.view.removeRepresentation(rep);
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
    pushMakerViewport({ state, dispatch }) {
      const viewport = state.view
        .getReferenceByName("orientationWidget")
        .getRenderer()
        .getViewport();
      dispatch(
        "network/call",
        {
          command: "opengeode.marker.viewport",
          args: [viewport],
        },
        { root: true }
      );
    },
    createView({ commit, dispatch }, { client, viewId }) {
      const view = vtkView.newInstance();
      const viewStream = client.getImageStream().createViewStream(viewId);
      const glwindow = view.getOpenglRenderWindow();
      const imageStyle = glwindow.getReferenceByName("bgImage").style;
      imageStyle.transition = "opacity 0.2s ease-in";
      console.log(imageStyle);
      viewStream.onImageReady(() => {
        imageStyle.opacity = "1";
        // glwindow.setUseBackgroundImage(true);
        glwindow.setUseOffScreen(true);
      });

      const north = vtkNorthActor.newInstance();
      const writer = vtkXMLPolyDataWriter.newInstance();
      const fileContent = writer.write(north.getMapper().getInputData());
      dispatch(
        "network/call",
        {
          command: "opengeode.marker.geometry",
          args: [fileContent],
        },
        { root: true }
      );
      view.registerOrientationAxis("north", north);
      view.setOrientationAxesType("north");

      const interactor = view.getRenderWindow().getInteractor();
      interactor.onLeftButtonPress(() => {
        imageStyle.opacity = "0";
        // glwindow.setUseBackgroundImage(false);
        glwindow.setUseOffScreen(false);
      });
      interactor.onLeftButtonRelease(() => {
        dispatch("pushCamera");
      });
      interactor.onStartMouseWheel(() => {
        imageStyle.opacity = "0";
        // glwindow.setUseBackgroundImage(false);
        glwindow.setUseOffScreen(false);
      });
      interactor.onEndMouseWheel(() => {
        dispatch("pushCamera");
      });

      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);
      commit("registerView", view);
      commit("registerViewId", viewId);
      commit("registerWidgetManager", widgetManager);
      commit("registerViewStream", viewStream);

      dispatch("pushCamera");
      dispatch("pushMakerViewport");
    },
    createLocalObject({ commit }, data) {
      const reader = vtkXMLPolyDataReader.newInstance();
      const textEncoder = new TextEncoder();
      reader.parseAsArrayBuffer(textEncoder.encode(data));
      const polydata = reader.getOutputData();
      const source = vtkSource.newInstance();
      source.setInputData(polydata);
      const rep = vtkGeometryRepresentation.newInstance();
      rep.setInput(source);
      rep.setPointSize(5);
      rep.setColor([0, 150 / 255, 136 / 255]); // primary
      commit("addRepresentation", rep);
      return { data: polydata, source, rep };
    },
    setVisibility({ commit, rootGetters }, { id, value }) {
      const rep = rootGetters.object(id).vtk.rep;
      if (value) {
        commit("addRepresentation", rep);
      } else {
        commit("removeRepresentation", rep);
      }
    },
  },
};

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

import Vue from "vue";
import Vuex from "vuex";
import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import ProxyConfig from "@/config/proxy";
import viewHelper from "@/config/viewHelper";
import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";
import treeview from "./treeview";
import ui from "./ui";
import os from "os";

Vue.use(Vuex);

function createSource(proxyManager, dataset) {
  const source = proxyManager.createProxy("Sources", "TrivialProducer");
  source.setInputData(dataset);
  source.activate();
  proxyManager.createRepresentationInAllViews(source);
  return source;
}

export default new Vuex.Store({
  state: {
    proxyManager: vtkProxyManager.newInstance({
      proxyConfiguration: ProxyConfig
    }),
    vtkBackground: "#666",
    data: []
  },
  getters: {
    view: state => viewHelper.getView(state.proxyManager, DEFAULT_VIEW_TYPE)
  },
  mutations: {
    registerData(state, object) {
      state.data.push(object);
    },
    setBackground(state, background) {
      state.vtkBackground = background;
    }
  },
  actions: {
    loadModule(context, path) {
      __non_webpack_require__(path)(this, os.platform());
    },
    registerObjectType({ dispatch }, type) {
      dispatch("treeview/registerObjectType", type);
    },
    addObject({ state, commit, dispatch }, { type, name, cpp, vtk }) {
      const proxyManager = state.proxyManager;
      let source = {};
      if (vtk.isA && vtk.isA("vtkPolyData")) {
        source = createSource(proxyManager, vtk);
      } else {
        Object.keys(vtk).forEach(key => {
          source[key] = [];
          vtk[key].forEach(dataset => {
            source[key].push(createSource(proxyManager, dataset));
          });
        });
      }
      dispatch("treeview/registerObject", { type, name, cpp, source }).then(
        object => commit("registerData", object)
      );
      proxyManager.renderAllViews();
      return source;
    }
  },
  modules: {
    treeview,
    ui
  }
});

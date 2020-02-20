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

import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";
import os from "os";
// import vtkImplicitPlaneWidget from
// 'vtk.js/Sources/Widgets/Widgets3D/ImplicitPlaneWidget';
import Vue from "vue";
import Vuex from "vuex";

import busy from "./busy";
import network from "./network";
import treeview from "./treeview";
import ui from "./ui";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { vtkBackground: { r: 0.4, g: 0.4, b: 0.4 }, data: [] },
  mutations: {
    registerData(state, object) {
      state.data.push(object);
    },
    setBackground(state, background) {
      state.vtkBackground = background;
    },
    setObjectStyle(state, { id, style, value }) {
      const index = state.data.findIndex(item => item.id === id);
      let object = state.data[index].style;
      for (let i = 0; i < style.length - 1; ++i) {
        let key = style[i];
        if (key in object) {
          object = object[key];
        }
      }
      let key = style[style.length - 1];
      if (key in object) {
        object[key] = value;
      }
    }
  },
  actions: {
    loadConfigFile({ dispatch }, path) {
      const config = __non_webpack_require__(path);
      if (config.modules) {
        config.modules.forEach(module => dispatch("loadModule", module));
      }
    },
    loadModule(context, module) {
      __non_webpack_require__(module)(this, os.platform());
    },
    registerObjectType({ dispatch }, type) {
      dispatch("treeview/registerObjectType", type);
    },
    addObject({ commit, dispatch }, { type, name, id, style }) {
      let objectStyle = style || {};
      // objectStyle.clipper = {
      //   widget: vtkImplicitPlaneWidget.newInstance(),
      //   clip: false,
      //   display: true,
      //   fixed: false
      // };
      const newObject = { id, name, type, style: objectStyle };
      dispatch("treeview/registerObject", newObject);
      commit("registerData", newObject);
    }
  },
  modules: { busy, network, treeview, ui }
});

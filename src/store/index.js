/*
 * Copyright (C) 2019 - 2022 Geode-solutions
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
import path from "path";

import network from "./network";
import treeview from "./treeview";
import ui from "./ui";
import view from "./view";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vtkBackground: { r: 0.4, g: 0.4, b: 0.4 },
    data: new Map(),
  },
  mutations: {
    registerData(state, object) {
      state.data.set(object.id, object);
      console.log(object.id);
    },
    setBackground(state, background) {
      state.vtkBackground = background;
    },
    setObjectStyle(state, { id, style, value }) {
      let object = state.data.get(id);
      if (object !== undefined && object.style) {
        object = object.style;
        for (let i = 0; i < style.length - 1; ++i) {
          const key = style[i];
          if (key in object) {
            object = object[key];
          }
        }
        const key = style[style.length - 1];
        if (key in object) {
          object[key] = value;
        }
      }
    },
  },
  getters: {
    object: (state) => (id) => {
      return state.data.get(id);
    },
  },
  actions: {
    loadConfigFile({ dispatch }, file) {
      console.log(file);
      const config = __non_webpack_require__(file);
      console.log("config.modules", config.modules);
      if (config.modules) {
        config.modules.forEach((module) => {
          console.log("module", module);
          if (typeof module === "string") {
            const configFile = path.resolve(module);
            console.log("configFile", configFile);
            console.log("configModule", path.dirname(configFile));
            dispatch("loadModule", path.dirname(configFile));
          } else {
            if (module.js) {
              dispatch("loadModule", module.js);
            }
          }
        });
      }
    },
    loadModule(context, module) {
      console.log("JS", module);
      __non_webpack_require__(module)(this);
    },
    registerObjectType({ dispatch }, type) {
      dispatch("treeview/registerObjectType", type);
    },
    addObject({ commit, dispatch }, { type, name, id, style, data }) {
      let objectStyle = style || {};
      console.log(data);
      dispatch("view/createLocalObject", data).then((localObject) => {
        console.log(localObject);
        const newObject = {
          id,
          name,
          type,
          style: objectStyle,
          vtk: localObject,
        };
        console.log(newObject);
        dispatch("treeview/registerObject", newObject);
        commit("registerData", newObject);
      });
    },
  },
  modules: { network, treeview, ui, view },
});

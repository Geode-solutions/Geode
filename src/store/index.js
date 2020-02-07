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

import ProxyConfig from '@/config/proxy';
import {DEFAULT_VIEW_TYPE} from '@/config/viewConstants';
import viewHelper from '@/config/viewHelper';
import os from 'os';
import uuidv4 from 'uuid/v4';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';
import vtkImplicitPlaneWidget from 'vtk.js/Sources/Widgets/Widgets3D/ImplicitPlaneWidget';
import Vue from 'vue';
import Vuex from 'vuex';

import treeview from './treeview';
import ui from './ui';

Vue.use(Vuex);

function createSource(proxyManager, dataset) {
  const source = proxyManager.createProxy('Sources', 'TrivialProducer');
  source.setInputData(dataset);
  source.activate();
  proxyManager.getViews().forEach(v => {
    const rep = proxyManager.getRepresentation(source, v);
    const mapper = rep.getMapper();
    const ShaderReplacements = [];
    ShaderReplacements.push({
      shaderType: 'Vertex',
      originalValue: '//VTK::Clip::Dec',
      replaceFirst: true,
      replacementValue: [
        'uniform int numClipPlanes;                 ',
        'uniform vec4 clipPlanes[6];                ',
        'varying float clipDistancesVSOutput[6];    '
      ]
    });
    ShaderReplacements.push({
      shaderType: 'Vertex',
      originalValue: '//VTK::Clip::Impl',
      replaceFirst: true,
      replacementValue: [
        'for (int planeNum = 0; planeNum < 6; planeNum++) {',
        '  if (planeNum >= numClipPlanes) { break; }       ',
        '  bool clipped = dot(clipPlanes[planeNum], vertexMC) < 0.0;',
        '  clipDistancesVSOutput[planeNum] = clipped ? 1.0 : 0.0;',
        '}                                                 '
      ]
    });
    ShaderReplacements.push({
      shaderType: 'Fragment',
      originalValue: '//VTK::Clip::Dec',
      replaceFirst: true,
      replacementValue: [
        'uniform int numClipPlanes;             ',
        'varying float clipDistancesVSOutput[6];',
      ]
    });
    ShaderReplacements.push({
      shaderType: 'Fragment',
      originalValue: '//VTK::Clip::Impl',
      replaceFirst: true,
      replacementValue: [
        'for (int planeNum = 0; planeNum < 6; planeNum++) {',
        '  if (planeNum >= numClipPlanes) { break; }       ',
        '  if (clipDistancesVSOutput[planeNum] > 0.0) discard;',
        '}                                                 '
      ]
    });
    mapper.getViewSpecificProperties()['OpenGL'] = {ShaderReplacements};
  });
  return source;
}

export default new Vuex.Store({
  state: {
    proxyManager:
        vtkProxyManager.newInstance({proxyConfiguration: ProxyConfig}),
    vtkBackground: '#666',
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
    },
    setObjectStyle(state, {id, style, value}) {
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
    loadConfigFile({dispatch}, path) {
      const config = __non_webpack_require__(path);
      if (config.modules) {
        config.modules.forEach(module => dispatch('loadModule', module));
      }
    },
    loadModule(context, module) {
      __non_webpack_require__(module)(this, os.platform());
    },
    registerObjectType({dispatch}, type) {
      dispatch('treeview/registerObjectType', type);
    },
    addObject({state, commit, dispatch}, {type, name, cpp, vtk, style}) {
      const proxyManager = state.proxyManager;
      let source = {};
      if (vtk.isA && vtk.isA('vtkPolyData')) {
        source = createSource(proxyManager, vtk);
      } else {
        Object.keys(vtk).forEach(key => {
          source[key] = [];
          vtk[key].forEach(dataset => {
            source[key].push(createSource(proxyManager, dataset));
          });
        });
      }
      let objectStyle = style || {};
      objectStyle.clipper = {
        widget: vtkImplicitPlaneWidget.newInstance(),
        clip: false,
        display: true,
        fixed: false
      };
      const newObject =
          {id: uuidv4(), name, cpp, source, type, style: objectStyle, vtk};
      dispatch('treeview/registerObject', newObject);
      commit('registerData', newObject);
      proxyManager.renderAllViews();
      return source;
    }
  },
  modules: {treeview, ui}
});

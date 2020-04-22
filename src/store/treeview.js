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

import { v4 as uuidv4 } from 'uuid';

export default {
  namespaced: true,
  state: {
    tree: [],
    selectedTree: [],
    active: []
  },
  getters: {
    items: state => state.tree.filter(item => item.children.length),
    selections: (state, getters, rootState, rootGetters) =>
      state.selectedTree.filter(item => rootGetters.object(item))
  },
  mutations: {
    updateActive(state, value) {
      state.active = value;
    },
    updateSelectedTree(state, value) {
      state.selectedTree = value;
    },
    addSelectedTree(state, value) {
      state.selectedTree.push(value);
    },
    addTree(state, value) {
      state.tree.push(value);
    },
    addChildrenTree(state, { type, value }) {
      const node = state.tree.find(item => item.name === type);
      node.children.push(value);
    }
  },
  actions: {
    registerObjectType({ state, commit }, type) {
      if (!state.tree.filter(item => item.name === type).length) {
        commit("addTree", {
          id: uuidv4(),
          name: type,
          children: []
        });
      }
    },
    registerObject({ commit }, object) {
      commit("addChildrenTree", { type: object.type, value: object });
      commit("addSelectedTree", object.id);
    }
  }
};

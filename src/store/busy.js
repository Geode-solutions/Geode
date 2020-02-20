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

export default {
  namespaced: true,
  state: {
    count: 0,
    progress: 0
  },
  getters: {
    progress(state) {
      return state.progress;
    },
    count(state) {
      return state.count;
    }
  },
  mutations: {
    set_progress(state, value) {
      state.progress = value;
    },
    set_count(state, value) {
      state.count = value;
    }
  },
  actions: {
    update_progress({ state, commit }, delta = 0.5) {
      if (state.count) {
        commit("set_progress", state.progress + delta);
      } else {
        commit("set_progress", 0);
      }
    }
  }
};

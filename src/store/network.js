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

import WSLinkClient from "vtk.js/Sources/IO/Core/WSLinkClient";
import { connectImageStream } from "vtk.js/Sources/Rendering/Misc/RemoteView";
import SmartConnect from "wslink/src/SmartConnect";

WSLinkClient.setSmartConnectClass(SmartConnect);

export default {
  namespaced: true,
  state: { connected: false, client: null, config: null, busy: 0 },
  mutations: {
    set_client(state, client) {
      state.client = client;
    },
    set_config(state, config) {
      state.config = config;
    },
    set_connected(state, connected) {
      state.connected = connected;
    },
    set_busy(state, busy) {
      state.busy = busy;
    }
  },
  actions: {
    connect({ commit, state, dispatch }) {
      const { config, client } = state;
      if (client && client.isConnected()) {
        client.disconnect();
      }
      const clientToConnect = client || WSLinkClient.newInstance();
      clientToConnect.beginBusy();
      clientToConnect.onConnectionError(console.error);
      clientToConnect.onConnectionClose(console.error);
      clientToConnect.onBusyChange(busy => {
        commit("set_busy", busy);
      });
      clientToConnect.onConnectionReady(validClient => {
        commit("set_client", validClient);
        commit("set_connected", true);
        connectImageStream(validClient.getConnection().getSession());
        console.log("RESET");
        dispatch("call",{command:"opengeode.reset"});
        clientToConnect.endBusy();
      });

      clientToConnect.connect(config);
    },
    call({ state }, { command, args }) {
      if (state.client && state.client.isConnected()) {
        state.client.beginBusy();
        return new Promise((resolve, reject) => {
          state.client
            .getConnection()
            .getSession()
            .call(command, args)
            .then(response => {
              state.client.endBusy();
              resolve(response);
            })
            .catch(error => {
              state.client.endBusy();
              reject(error);
            });
        });
      }
    }
  }
};

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

import GeodeMouseHandler from "@/config/protocols/GeodeMouseHandler";
import ImageDelivery from "@/config/protocols/ImageDelivery";
import IOMesh from "@/config/protocols/IOMesh";
import MouseHandler from "@/config/protocols/MouseHandler";
import ViewPort from "@/config/protocols/ViewPort";
import WSLinkClient from "vtk.js/Sources/IO/Core/WSLinkClient";
import { connectImageStream } from "vtk.js/Sources/Rendering/Misc/RemoteView";
import SmartConnect from "wslink/src/SmartConnect";

const REMOTE_API = {
  MouseHandler,
  IOMesh,
  GeodeMouseHandler,
  ViewPort,
  ImageDelivery
};

WSLinkClient.setSmartConnectClass(SmartConnect);

export default {
  namespaced: true,
  state: { ok: false, client: null, config: null },
  mutations: {
    set_client(state, client) {
      state.client = client;
    },
    set_config(state, config) {
      state.config = config;
    },
    set_ok(state, ok) {
      state.ok = ok;
    }
  },
  actions: {
    connect({ commit, state }) {
      const { config, client } = state;
      if (client && client.isConnected()) {
        client.disconnect();
      }
      const clientToConnect = client || WSLinkClient.newInstance();
      clientToConnect.setProtocols(REMOTE_API);

      clientToConnect.beginBusy();

      clientToConnect.onConnectionError(console.error);
      clientToConnect.onConnectionClose(console.error);
      clientToConnect.onConnectionReady(validClient => {
        commit("set_client", validClient);
        commit("set_ok", true);

        // Need to bind ImageStream to connection only once.
        // After that you can create as many viewStream as you want...
        connectImageStream(validClient.getConnection().getSession());

        clientToConnect.endBusy();
      });

      clientToConnect.connect(config);
    }
  }
};

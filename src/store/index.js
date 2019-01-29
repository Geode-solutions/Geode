import Vue from "vue";
import Vuex from "vuex";
import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import ProxyConfig from "@/config/proxy";
import viewHelper from "@/config/viewHelper";
import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    proxyManager: vtkProxyManager.newInstance({
      proxyConfiguration: ProxyConfig
    })
  },
  getters: {
    view: state => {
      return viewHelper.getView(state.proxyManager, DEFAULT_VIEW_TYPE);
    }
  },
  mutations: {},
  actions: {}
});

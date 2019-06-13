import Vue from "vue";
import Vuex from "vuex";
import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import ProxyConfig from "@/config/proxy";
import viewHelper from "@/config/viewHelper";
import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";
import treeview from "./treeview";
import ui from "./ui";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    proxyManager: vtkProxyManager.newInstance({
      proxyConfiguration: ProxyConfig
    })
  },
  getters: {
    view: state => viewHelper.getView(state.proxyManager, DEFAULT_VIEW_TYPE)
  },
  actions: {
    load_module(context, path) {
      __non_webpack_require__(path)(this);
    },
    register_object_type({ commit }, type) {
      commit("treeview/register_object_type", type);
    },
    add_object({ state, commit }, { type, name, cpp, vtk }) {
      const proxyManager = state.proxyManager;
      const source = proxyManager.createProxy("Sources", "TrivialProducer");
      source.setInputData(vtk);
      source.activate();
      commit("treeview/register_object", { type, name, cpp, source });
      proxyManager.createRepresentationInAllViews(source);
      proxyManager.renderAllViews();
      return source;
    }
  },
  modules: {
    treeview,
    ui
  }
});

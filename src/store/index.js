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
    }),
    data: []
  },
  getters: {
    view: state => viewHelper.getView(state.proxyManager, DEFAULT_VIEW_TYPE)
  },
  mutations: {
    register_data(state, object) {
      state.data.push(object);
    }
  },
  actions: {
    load_module(context, path) {
      __non_webpack_require__(path)(this);
    },
    register_object_type({ dispatch }, type) {
      dispatch("treeview/register_object_type", type);
    },
    add_object({ state, commit, dispatch }, { type, name, cpp, vtk }) {
      const proxyManager = state.proxyManager;
      const source = proxyManager.createProxy("Sources", "TrivialProducer");
      source.setInputData(vtk);
      source.activate();
      dispatch("treeview/register_object", { type, name, cpp, source }).then(
        object => commit("register_data", object)
      );
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

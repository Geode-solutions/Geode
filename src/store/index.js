import Vue from "vue";
import Vuex from "vuex";
import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import ProxyConfig from "@/config/proxy";
import viewHelper from "@/config/viewHelper";
import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";
import treeview from "./treeview";
import ui from "./ui";
import os from "os";

Vue.use(Vuex);

function createSource(proxyManager, dataset) {
  const source = proxyManager.createProxy("Sources", "TrivialProducer");
  source.setInputData(dataset);
  source.activate();
  proxyManager.createRepresentationInAllViews(source);
  return source;
}

export default new Vuex.Store({
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
    registerData(state, object) {
      state.data.push(object);
    }
  },
  actions: {
    loadModule(context, path) {
      __non_webpack_require__(path)(this, os.platform());
    },
    registerObjectType({ dispatch }, type) {
      dispatch("treeview/registerObjectType", type);
    },
    addObject({ state, commit, dispatch }, { type, name, cpp, vtk }) {
      const proxyManager = state.proxyManager;
      let source = {};
      if (vtk.isA && vtk.isA("vtkPolyData")) {
        source = createSource(proxyManager, vtk);
      } else {
        Object.keys(vtk).forEach(key => {
          source[key] = [];
          vtk[key].forEach(dataset => {
            source[key].push(createSource(proxyManager, dataset));
          });
        });
      }
      dispatch("treeview/registerObject", { type, name, cpp, source }).then(
        object => commit("registerData", object)
      );
      proxyManager.renderAllViews();
      return source;
    }
  },
  modules: {
    treeview,
    ui
  }
});

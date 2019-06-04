import Vue from "vue";
import Vuex from "vuex";
import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import ProxyConfig from "@/config/proxy";
import viewHelper from "@/config/viewHelper";
import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";
import ui from "./ui";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    proxyManager: vtkProxyManager.newInstance({
      proxyConfiguration: ProxyConfig
    }),
    data: new Map()
  },
  getters: {
    view: state => {
      return viewHelper.getView(state.proxyManager, DEFAULT_VIEW_TYPE);
    }
  },
  mutations: {
    load_module(state, path) {
      console.log(path);
      const module = __non_webpack_require__(path);
      console.log(module);
      console.log(state.data);
      console.log(state.ui.input);
      module(this);
    },
    register_object_type(state, type) {
      if (!state.data.has(type)) {
        state.data.set(type, []);
      }
    },
    add_object(state, {type,name,cpp,vtk}) {
      const proxyManager = state.proxyManager;
      const source = proxyManager.createProxy("Sources", "TrivialProducer");
      source.setInputData(vtk);
      source.activate();
      proxyManager.createRepresentationInAllViews(source);
      proxyManager.renderAllViews();
      state.data.get(type).push( {name,cpp,source});
    }
  },
  actions: {},
  modules: {
    ui
  }
});

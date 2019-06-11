import Vue from "vue";
import Vuex from "vuex";
import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import ProxyConfig from "@/config/proxy";
import viewHelper from "@/config/viewHelper";
import { DEFAULT_VIEW_TYPE } from "@/config/viewConstants";
import ui from "./ui";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    proxyManager: vtkProxyManager.newInstance({
      proxyConfiguration: ProxyConfig
    }),
    tree: [],
    data: new Map(),
    count: 0,
    value: []
  },
  getters: {
    view: state => {
      return viewHelper.getView(state.proxyManager, DEFAULT_VIEW_TYPE);
    },
    items: state => {
      return state.tree.filter(item => item.children.length);
    }
  },
  mutations: {
    register_object_type(state, type) {
      if (!state.tree.filter(item => item.name === type).length) {
        state.tree.push({ id: state.count++, name: type, children: [] });
      }
    },
    register_object(state, { type, name, cpp, source }) {
      let node = state.tree.find(item => {
        return item.name === type;
      });
      let new_object = { id: state.count++, name, cpp, source };
      node.children.push(new_object);
      state.data.set(new_object.id, new_object);
      this._vm.$emit("tutu");
      state.value.push(new_object.id);
    }
  },
  actions: {
    load_module(context, path) {
      console.log(context);
      __non_webpack_require__(path)(this);
    },
    add_object({ state, commit }, { type, name, cpp, vtk }) {
      const proxyManager = state.proxyManager;
      const source = proxyManager.createProxy("Sources", "TrivialProducer");
      source.setInputData(vtk);
      source.activate();
      proxyManager.createRepresentationInAllViews(source);
      proxyManager.renderAllViews();
      commit("register_object", { type, name, cpp, source });
      return source;
    }
  },
  modules: {
    ui
  }
});

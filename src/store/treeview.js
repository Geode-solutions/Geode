import uuidv4 from "uuid/v4";

export default {
  namespaced: true,
  state: {
    tree: [],
    selectedTree: [],
    active: []
  },
  getters: {
    items: state => state.tree.filter(item => item.children.length)
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
    registerObject({ commit }, { type, name, cpp, source }) {
      const newObject = {
        id: uuidv4(),
        name,
        cpp,
        source,
        type
      };
      commit("addChildrenTree", { type, value: newObject });
      commit("addSelectedTree", newObject.id);
      return newObject;
    }
  }
};

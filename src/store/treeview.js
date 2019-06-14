import uuidv4 from "uuid/v4";

export default {
  namespaced: true,
  state: {
    tree: [],
    selected_tree: [],
    active: []
  },
  getters: {
    items: state => state.tree.filter(item => item.children.length)
  },
  mutations: {
    update_active(state, value) {
      state.active = value;
    },
    update_selected_tree(state, value) {
      state.selected_tree = value;
    },
    add_selected_tree(state, value) {
      state.selected_tree.push(value);
    },
    add_tree(state, value) {
      state.tree.push(value);
    },
    add_children_tree(state, { type, value }) {
      const node = state.tree.find(item => item.name === type);
      node.children.push(value);
    }
  },
  actions: {
    register_object_type({ state, commit }, type) {
      if (!state.tree.filter(item => item.name === type).length) {
        commit("add_tree", {
          id: uuidv4(),
          name: type,
          children: []
        });
      }
    },
    register_object({ commit }, { type, name, cpp, source }) {
      const new_object = {
        id: uuidv4(),
        name,
        cpp,
        source
      };
      commit("add_children_tree", { type, value: new_object });
      commit("add_selected_tree", new_object.id);
      return new_object;
    }
  }
};

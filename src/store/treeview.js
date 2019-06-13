import uuidv4 from "uuid/v4";

export default {
  namespaced: true,
  state: {
    tree: [],
    active: []
  },
  getters: {
    items: state => state.tree.filter(item => item.children.length),
    active_object: state => state.active.filter(item => item.source)
  },
  mutations: {
    register_object_type(state, type) {
      if (!state.tree.filter(item => item.name === type).length) {
        state.tree.push({
          id: uuidv4(),
          name: type,
          children: []
        });
      }
    },
    register_object(state, { type, name, cpp, source }) {
      const node = state.tree.find(item => item.name === type);
      node.children.push({
        id: uuidv4(),
        name,
        cpp,
        source
      });
    },
    update_active(state, active) {
      state.active = active;
    }
  }
};

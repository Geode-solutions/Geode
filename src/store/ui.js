export default {
  namespaced: true,
  state: {
    inputs: []
  },
  mutations: {
    register_input(state, { name, action }) {
      state.inputs.push({
        name: name,
        action: action
      });
    }
  }
};

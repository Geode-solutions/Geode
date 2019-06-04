export default {
  namespaced: true,
  state: {
    input: []
  },
  getters: {
    getInputs: state => {
      return state.input;
    }
  },
  mutations: {
    register_input(state, { name, action }) {
      state.input.push({
        name: name,
        action: action
      });
    }
  }
};

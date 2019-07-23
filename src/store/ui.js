import Hide from "@/components/view/config/Hide";
import Rename from "@/components/view/config/Rename";
import Vue from "vue";

function createContextualItem(type, icon, tooltip, component) {
  Vue.component(component.name + "ContextualItem", component);
  return { type, icon, tooltip, component, top: "", left: "" };
}

function initialContextualItems() {
  let items = [];
  items.push(createContextualItem("all", "fas fa-eye-slash", "Hide", Hide));
  items.push(createContextualItem("all", "fas fa-edit", "Rename", Rename));
  return items;
}

export default {
  namespaced: true,
  state: {
    inputs: [],
    contextualItems: initialContextualItems()
  },
  getters: {
    filteredInputs: state => id => {
      return state.inputs.filter(input => input.parent === id);
    }
  },
  mutations: {
    registerContextualItem(state, { type, icon, tooltip, component }) {
      state.contextualItems.push(
        createContextualItem(type, icon, tooltip, component)
      );
    },
    registerInputItem(state, { parent, name, action, icon, tooltip }) {
      state.inputs.push({
        parent,
        name,
        icon,
        tooltip,
        action
      });
    }
  }
};

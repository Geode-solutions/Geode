/*
 * Copyright (C) 2019 - 2021 Geode-solutions
 *
 * This file is a part of Geode library.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 */

import router from "../router";

export default {
  namespaced: true,
  state: {
    inputs: [],
    contextualItems: [],
    routes: [
      { tooltip: "Data manager", icon: "fas fa-database", route: "/data" },
      { tooltip: "Viewer", icon: "fas fa-video", route: "/viewer" },
    ],
  },
  getters: {
    filteredInputs: (state) => (id) => {
      return state.inputs.filter((input) => input.parent === id);
    },
    contextualItems: (state) => (type) => {
      return state.contextualItems.filter(
        (item) => (item.type === "all" || item.type === type) && item.visible
      );
    },
  },
  mutations: {
    registerContextualItem(state, { type, component }) {
      state.contextualItems.push({ type, component, visible: true });
    },
    registerInputItem(
      state,
      { parent, name, action, icon, component, tooltip }
    ) {
      state.inputs.push({
        parent,
        name,
        icon,
        component,
        tooltip,
        action,
      });
    },
    setContextualItemVisibility(state, { name, value }) {
      state.contextualItems.forEach((item) => {
        if (item.component.name === name) {
          item.visible = value;
        }
      });
    },
    registerRoute(
      state,
      { tooltip, icon, iconComponent, route, component, children }
    ) {
      state.routes.push({ tooltip, icon, iconComponent, route });
      router.addRoutes([{ path: route, component, children }]);

      let { routes } = router.options;
      console.log(this.$router);
      console.log("add routes", routes);
    },
    addRouteChild(state, { route, path, component }) {
      router.addRoutes([{ path, component, props: true }]);
      // let { routes } = router.options;
      // console.log("add routes 2", routes);
      // let routeData = routes.find((r) => console.log(r.path));
      console.log(route);
      // console.log(routeData)
      // console.log(path)
      // console.log(component)
      // routeData.children.push({ path, component });
      // router.addRoutes([routeData]);
    },
  },
};

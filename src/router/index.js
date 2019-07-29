/*
 * Copyright (C) 2019 Geode-solutions
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

import Vue from "vue";
import Router from "vue-router";
import DataManager from "./DataManager";
import DataManagerHome from "./DataManager/Home";
import DataManagerImport from "./DataManager/Import";
import Viewer from "./Viewer";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "", redirect: "/data" },
    {
      path: "/data",
      component: DataManager,
      children: [
        { path: "", redirect: "/data/home" },
        { path: "home", component: DataManagerHome },
        {
          path: "import",
          component: DataManagerImport
        }
      ]
    },
    { path: "/viewer", component: Viewer }
  ]
});

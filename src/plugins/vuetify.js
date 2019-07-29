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
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import colors from "vuetify/es5/util/colors";
import "@fortawesome/fontawesome-free/css/all.css";
import Logo from "@/components/Logo";

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.darken1,
    secondary: colors.teal.lighten4,
    accent: colors.red.darken4,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  },
  iconfont: "fa",
  options: {
    customProperties: true
  },
  icons: {
    logo: {
      component: Logo
    }
  }
});

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
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";
import "@fortawesome/fontawesome-free/css/all.css";
import Logo from "@/components/Logo";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.teal.darken1,
        secondary: colors.teal.lighten4,
        accent: colors.red.darken4,
      },
    },
    options: {
      customProperties: true,
    },
  },
  icons: {
    iconfont: "fa",
    values: {
      logo: {
        component: Logo,
      },
    },
  },
});

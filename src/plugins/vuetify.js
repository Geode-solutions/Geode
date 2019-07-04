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

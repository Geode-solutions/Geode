import Vue from "vue";
import Router from "vue-router";
import Viewer from "./Viewer";
import About from "./About";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/viewer",
      name: "viewer",
      component: Viewer
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});

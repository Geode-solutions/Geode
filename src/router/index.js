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

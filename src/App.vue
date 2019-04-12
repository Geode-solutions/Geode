<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <input id="fileInput" type="file" style="display:none;" />
      <v-btn flat @click.native="openFile">
        <v-icon>publish</v-icon>
        <span>LOAD</span>
      </v-btn>
      <v-btn flat @click.native="toto">
        <v-icon>publish</v-icon>
        <span>Test</span>
      </v-btn>
    </div>
    <router-view />
  </div>
</template>

<script>
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";

export default {
  name: "App",
  methods: {
    load_plugin(plugin) {
      var path = require('path');
      //require('app-module-path').addPath(this.ringmeshPath + '/node')
      //return eval(`require('${plugin}')`)
      return __non_webpack_require__(
        path.normalize("D:\\Programming\\OpenGeode_node\\build\\bin\\Release\\" + plugin)
      );
    },
    toto() {
      const proxyManager = this.$store.state.proxyManager;
      const source = proxyManager.createProxy("Sources", "TrivialProducer");
      const points = new Float32Array(3 * 3);
      points[0] = -10.5;
      points[1] = -10.5;
      points[2] = -10.5;
      points[3] = 0.5;
      points[4] = 10.5;
      points[5] = 0.5;
      points[6] = 10.5;
      points[7] = 10.5;
      points[8] = 10.5;
      const trgls = new Uint32Array(4);
      trgls[0] = 3;
      trgls[1] = 0;
      trgls[2] = 1;
      trgls[3] = 2;
      let dataset = vtkPolyData.newInstance();
      dataset.getPoints().setData(points, 3);
      dataset.getPolys().setData(trgls);
      console.log(dataset);
      console.log(dataset.getPoints());
      console.log(dataset.getPoints().getData());
      source.setInputData(dataset);
      source.activate();
      proxyManager.createRepresentationInAllViews(source);

      const myRepresentations = proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === source);
      console.log(proxyManager.getRepresentations());
      console.log(myRepresentations);
      myRepresentations[0].setRepresentation("Surface with edges");
      myRepresentations[0].setPointSize(10);
      myRepresentations[0].setVisibility(true);
      myRepresentations[0].setColor(1, 0, 0);
      proxyManager.renderAllViews();
    },
    openFile() {
      //const geomodelCore = this.load_plugin("basic");
      console.log("======");
      var input = document.getElementById("fileInput");
      //    const mesh = requireFunc('/home/camaud/programming/georep/build/Debug/georep/node/georep/basi.node')

      input.click();
      input.onchange = function() {
        console.log(document.getElementById("fileInput").files[0]);
        const basic = require('bindings')(
          {
            module_root: "D:\\Programming\\OpenGeode_node",
            bindings: document.getElementById("fileInput").files[0].name
          });
        console.log(basic);
      };
    }
  }
};
</script>

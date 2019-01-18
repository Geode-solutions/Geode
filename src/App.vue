<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <input id="fileInput" type="file" style="display:none;" />
        <v-btn
          flat
          @click.native="openFile"
        >
            <v-icon>publish</v-icon>
            <span>LOAD</span>
        </v-btn>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    load_plugin(plugin) {
      //require('app-module-path').addPath(this.ringmeshPath + '/node')
      //return eval(`require('${plugin}')`)
      return __non_webpack_require__(
        "/home/camaud/programming/OpenGeode_node/build/lib/" + plugin
      );
    },
    openFile() {
      const geomodelCore = this.load_plugin("basic");
      console.log("======");
      var input = document.getElementById("fileInput");
      //    const mesh = requireFunc('/home/camaud/programming/georep/build/Debug/georep/node/georep/basi.node')

      input.click();
      input.onchange = function() {
        console.log(document.getElementById("fileInput").files[0]);
      };
    }
  }
};
</script>

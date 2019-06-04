<template>
  <v-app>
    <v-toolbar color="primary">
      <v-toolbar-title>Geode-solutions</v-toolbar-title>
      <v-spacer></v-spacer>
      <load-file></load-file>
    </v-toolbar>
    <router-view />
  </v-app>
</template>

<script>
import LoadFile from "@/components/LoadFile.vue";

export default {
  name: "App",
  components: {
    LoadFile
  },
  created() {
    this.$store.commit(
      "load_module",
      "/home/camaud/programming/OpenGeode_node"
    );
  }
};
</script>

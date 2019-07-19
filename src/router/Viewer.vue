<template>
  <vtk-view />
</template>

<script>
import VtkView from "@/components/view/VtkView";

export default {
  name: "Viewer",
  components: {
    VtkView
  },
  mounted() {
    console.log("MOUNTED VIEWER");
  }
};
</script>

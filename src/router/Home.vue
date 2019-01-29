<template>
  <div class="home">
    <vtk-view/>
  </div>
</template>

<script>
// @ is an alias to /src
import VtkView from "@/components/VtkView.vue";

export default {
  name: "home",
  components: {
    VtkView
  }
};
</script>

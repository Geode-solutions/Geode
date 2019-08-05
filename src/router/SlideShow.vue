<!--
Copyright (C) 2019 Geode-solutions

This file is a part of Geode library.

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.
-->

<template>
  <div class="reveal">
    <div class="slides">
      <section>Single Horizontal Slide</section>
      <section>
        <section>Vertical Slide 1</section>
        <section style="height: 100%">
          <vtk-view />
        </section>
      </section>
      <section>Single Horizontal Slide</section>
      <section>Single Horizontal Slide</section>
    </div>
  </div>
</template>

<script>
import Reveal from "reveal.js/js/reveal";
import "reveal.js/css/reveal.css";
import "reveal.js/css/theme/white.css";
import VtkView from "@/components/view/VtkView";

export default {
  name: "SlideShow",
  components: {
    VtkView
  },
  mounted() {
    Reveal.initialize();
  }
};
</script>

<style>
.reveal .controls {
  color: var(--v-primary-base);
}
.reveal .progress {
  color: var(--v-primary-base);
}
</style>

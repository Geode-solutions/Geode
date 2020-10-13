<!--
Copyright (C) 2019 - 2020 Geode-solutions

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
  <vtk-view />
</template>

<script>
import VtkView from "../components/view/VtkView";

export default {
  name: "Viewer",
  components: {
    VtkView,
  },
  mounted() {
    console.log("MOUNTED VIEWER");
  },
};
</script>

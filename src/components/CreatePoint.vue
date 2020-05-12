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
  <v-dialog v-model="value" max-width="290">
    <v-card>
      <v-card-title>Create a point</v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Name"></v-text-field>
        <v-text-field v-model="x" label="X"></v-text-field>
        <v-text-field v-model="y" label="Y"></v-text-field>
        <v-text-field v-model="z" label="Z"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="create">
          Create
        </v-btn>

        <v-btn text @click="close">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";

export default {
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
  data: () => ({
    name: "debug",
    x: 0,
    y: 0,
    z: 0,
  }),
  methods: {
    close() {
      this.$emit("input", false);
    },
    create() {
      let vtk = vtkPolyData.newInstance();
      const points = new Float32Array([this.x, this.y, this.z]);
      vtk.getPoints().setData(points, 3);
      const verts = new Uint32Array([1, 0]);
      vtk.getVerts().setData(verts);
      this.$store
        .dispatch("addObject", { type: "PointSet3D", name: this.name, vtk })
        .then((source) =>
          this.proxyManager
            .getRepresentations()
            .filter((r) => r.getInput() === source)
            .forEach((r) => {
              r.setRepresentation("Points");
              r.setPointSize(5);
            })
        );
    },
  },
};
</script>

<style scoped>
* {
  text-transform: none !important;
}
.v-btn {
  margin-top: -5px;
}
</style>
<style>
html {
  overflow-y: hidden;
}
</style>

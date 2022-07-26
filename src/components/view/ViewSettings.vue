<!--
Copyright (C) 2019 - 2022 Geode-solutions

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
  <v-color-picker
    v-model="color"
    style="position: absolute; top: 10px; right: 50px"
  ></v-color-picker>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "ViewSettings",
  props: {
    view: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapState("network", ["client"]),
    color: {
      get() {
        return this.$store.state.vtkBackground;
      },
      set(value) {
        this.$store.commit("setBackground", value);
        this.call({
          command: "geode.ui.background",
          args: [this.view, value.r / 255, value.g / 255, value.b / 255],
        });
      },
    },
  },
  methods: {
    ...mapActions("network", ["call"]),
  },
};
</script>

<style></style>

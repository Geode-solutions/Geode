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
  <v-navigation-drawer
    v-model="visible"
    stateless
    mini-variant
    mini-variant-width="60"
    class="secondary"
  >
    <v-row dense class="flex-column">
      <v-col v-for="item in items" :key="item.tooltip">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              class="grey--text mx-2"
              style="left: 10px"
              icon
              active-class="text--darken-2"
              :to="item.route"
              v-on="on"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "RouteSelector",
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    items: [
      { tooltip: "Data manager", icon: "fas fa-database", route: "/data" },
      { tooltip: "Viewer", icon: "fas fa-video", route: "/viewer" },
      {
        tooltip: "SlideShow",
        icon: "fas fa-chalkboard-teacher",
        route: "/slideshow"
      }
    ]
  })
};
</script>

<style scoped>
.v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
  opacity: 0;
}
</style>

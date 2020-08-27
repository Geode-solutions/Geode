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
  <v-navigation-drawer
    v-model="visible"
    stateless
    mini-variant
    mini-variant-width="60"
    class="secondary"
  >
    <v-row dense class="flex-column">
      <v-col v-for="route in routes" :key="route.tooltip">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              class="grey--text mx-2"
              style="left: 10px;"
              icon
              active-class="text--darken-2"
              :to="route.route"
              v-on="on"
            >
              <component
                :is="route.iconComponent"
                v-if="route.iconComponent"
                style="height: 30px; width: 30px; fill='currentColor'"
              />
              <v-icon v-else>
                {{ route.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ route.tooltip }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "RouteSelector",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState("ui", ["routes"]),
  },
};
</script>

<style scoped>
.v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
  opacity: 0;
}
</style>

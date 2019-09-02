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
  <v-row justify="space-around" align="center">
    <v-tooltip v-for="(action, index) in actions" :key="index" bottom>
      <template #activator="{ on }">
        <v-card
          width="200"
          height="200"
          raised
          :class="$style.roundedCard"
          hover
          :to="action.route"
          v-on="on"
        >
          <v-card-text class="justify-center align-center">
            <v-icon size="150">
              {{ action.icon }}
            </v-icon>
          </v-card-text>
        </v-card>
      </template>
      <span>{{ action.tooltip }}</span>
    </v-tooltip>
  </v-row>
</template>

<script>
export default {
  name: "DataManagerHome",
  data: () => ({
    actions: [
      {
        tooltip: "Import file",
        icon: "fas fa-file-export",
        route: "/data/import"
      }
    ]
  })
};
</script>

<style module>
.roundedCard {
  border-radius: 50px;
}
</style>

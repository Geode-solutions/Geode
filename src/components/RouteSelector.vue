<template>
  <v-navigation-drawer
    permanent
    mini-variant
    mini-variant-width="50"
    class="secondary"
  >
    <v-tooltip v-for="item in items" :key="item.tooltip" bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          class="grey--text"
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
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "RouteSelector",
  data() {
    return {
      items: [
        { tooltip: "Data manager", icon: "fas fa-database", route: "about" },
        { tooltip: "Viewer", icon: "fas fa-video", route: "viewer" }
      ]
    };
  }
};
</script>

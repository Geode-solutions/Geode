<template>
  <v-layout row wrap justify-space-around align-center>
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
  </v-layout>
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

<template>
  <v-container fill-height>
    <v-layout column>
      <h1 class="display-3">
        Data Manager
      </h1>
      <router-view />
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "DataManager"
};
</script>

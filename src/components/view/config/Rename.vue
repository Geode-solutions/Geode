<template>
  <command-dialog :visible.sync="dialog" @apply="rename">
    <template #title>
      Rename {{ item.name }}
    </template>
    <v-text-field v-model="newName" label="New name" :rules="nameRules" />
  </command-dialog>
</template>

<script>
import CommandDialog from "./CommandDialog";
import ContextualItemMixin from "./ContextualItemMixin";

export default {
  name: "Rename",
  components: {
    CommandDialog
  },
  mixins: [ContextualItemMixin],
  data: () => ({
    newName: "",
    nameRules: [v => !!v || "Name is required"]
  }),
  methods: {
    rename() {
        this.item.name = this.newName;
    }
  }
};
</script>

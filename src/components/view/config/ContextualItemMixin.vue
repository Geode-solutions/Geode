<script>
export default {
  name: "ContextualItemMixin",
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    item: {
      required: true,
      type: Object
    }
  },
  computed: {
    dialog: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      }
    }
  }
};
</script>

<script>
export default {
  name: "Hide",
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    item: {
      required: true,
      type: Object,
    },
  },
  computed: {
    hide: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
  watch: {
    visible: function () {
      if (this.visible) {
        console.log("HIDE2");
        this.hide = false;
      } else {
        console.log("HIDE3");
      }
    },
  },
  created() {
    console.log("HIDE");
    this.visible = false;
  },
  render() {},
};
</script>

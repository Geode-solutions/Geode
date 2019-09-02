<template>
  <div>
    <div
      :class="[$style.disk, $style.outerDisk, 'ring', 'elevation-10']"
      :style="diskStyle"
      @click.stop
    >
      <component
        :is="item.component"
        v-for="(item, index) in contextualItems"
        :key="index"
        :btn-style="item.btnStyle"
        :left="item.left"
        :item="selectedItem"
        @update="computeItems"
      />
    </div>
    <div :class="[$style.disk, $style.innerDisk]" :style="innerDiskStyle" />
  </div>
</template>

<script>
export default {
  name: "ContextualMenu",
  props: {
    position: {
      required: true,
      type: Object
    },
    selectedItem: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    width: 300,
    ringWidth: 80,
    diskStyle: {
      width: "",
      height: "",
      borderWidth: "",
      bottom: "",
      left: ""
    },
    innerDiskStyle: {
      width: "",
      height: "",
      borderWidth: "",
      bottom: "",
      left: ""
    },
    contextualItems: []
  }),
  computed: {
    radius() {
      return this.width / 2;
    },
    innerRadius() {
      return this.innerWidth / 2;
    },
    innerWidth() {
      return this.width - 2 * this.ringWidth;
    },
    btnSize() {
      return (3 * this.ringWidth) / 4;
    }
  },
  mounted() {
    this.computeSizes();
    this.computePositions();
    this.computeItems();
  },
  methods: {
    computeSizes() {
      this.diskStyle.width = this.width + "px";
      this.diskStyle.height = this.width + "px";
      this.diskStyle.borderWidth = this.ringWidth + "px";
      this.innerDiskStyle.width = this.innerWidth + "px";
      this.innerDiskStyle.height = this.innerWidth + "px";
      this.innerDiskStyle.borderWidth = this.innerRadius + "px";
    },
    computePositions() {
      this.diskStyle.left = this.position.x - this.radius + "px";
      this.diskStyle.bottom = this.position.y - this.radius + "px";
      this.innerDiskStyle.left = this.position.x - this.innerRadius + "px";
      this.innerDiskStyle.bottom = this.position.y - this.innerRadius + "px";
    },
    computeItems() {
      console.log("new items");
      this.contextualItems = this.$store.getters["ui/contextualItems"](
        this.selectedItem.type
      );
      const frags = 360 / this.contextualItems.length;
      const angles = this.contextualItems.map(
        (item, index) => (frags * index * Math.PI) / 180
      );
      this.contextualItems.forEach((item, index) => {
        let left =
          this.innerRadius +
          (Math.cos(angles[index]) * (this.innerRadius + this.radius)) / 2 -
          this.btnSize / 2;
        let top =
          this.innerRadius +
          (Math.sin(angles[index]) * (this.innerRadius + this.radius)) / 2 -
          this.btnSize / 2;
          item.left = left;
          item.btnStyle = {
            left: left + 'px',
            top: top + 'px',
            width: this.btnSize + 'px',
            height: this.btnSize + 'px'
          }
      });
    }
  }
};
</script>

<style module>
.disk {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
}
.outerDisk {
  border-color: var(--v-primary-base);
}
.innerDisk {
  opacity: 0;
}
</style>

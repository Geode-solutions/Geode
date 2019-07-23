<template>
  <v-dialog
    v-model="dialog"
    width="500"
    content-class="dialog"
    attach
    hide-overlay
    persistent
  >
    <v-card>
      <v-card-title
        class="headline"
        style="cursor: move;"
        primary-title
        @mousedown="dragMouseDown"
      >
        <slot name="title" />
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <slot />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-tooltip v-for="(button, index) in buttons" :key="index" top>
          {{ button.tooltip }}
          <template #activator="{ on }">
            <v-btn
              :color="button.color"
              outline
              v-on="on"
              @click="button.action"
            >
              <v-icon>{{ button.icon }}</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CommandDialog",
  props: {
    visible: {
      required: true,
      type: Boolean
    }
  },
  data: () => ({
    buttons: [
      {
        tooltip: "Apply",
        icon: "fas fa-check",
        color: "primary",
        action: this.apply
      },
      {
        tooltip: "Apply & Close",
        icon: "fas fa-check-double",
        color: "primary",
        action: this.applyClose
      },
      {
        tooltip: "Close",
        icon: "fas fa-times",
        color: "accent",
        action: this.close
      }
    ],
    initX: "",
    initY: ""
  }),
  computed: {
    dialog: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      }
    }
  },
  methods: {
    dragMouseDown(e) {
      let element = this.$el.querySelector(".dialog");
      this.initX = element.offsetLeft - e.clientX;
      this.initY = element.offsetTop - e.clientY;
      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
    },
    elementDrag(e) {
      let element = this.$el.querySelector(".dialog");
      element.style.top = this.initY + e.clientY + "px";
      element.style.left = this.initX + e.clientX + "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    close() {
      this.dialog = false;
    },
    apply() {
      if (this.$refs.form.validate()) {
        this.$emit("apply");
      }
    },
    applyClose() {
      this.apply();
      this.close();
    }
  }
};
</script>

<style>
.dialog {
  position: absolute;
}
</style>

<!--
Copyright (C) 2019 - 2021 Geode-solutions

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
  <div>
    <v-treeview
      v-model="selectedTree"
      :items="items"
      :active.sync="active"
      activatable
      selectable
      dense
    >
      <template slot="label" slot-scope="{ item }">
        <span @contextmenu="openContextualMenu($event, item)">{{
          item.name
        }}</span>
      </template>
    </v-treeview>
    <contextual-menu
      v-if="displayMenu"
      v-model="displayMenu"
      :selected-item="selectedItem"
      :position="menuPosition"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContextualMenu from "./ContextualMenu";

export default {
  name: "ObjectTree",
  components: {
    ContextualMenu,
  },
  data: () => ({
    selectedItem: {},
    displayMenu: false,
    menuPosition: {},
    left: 0,
    top: 0,
  }),
  computed: {
    ...mapGetters("treeview", ["items", "selections"]),
    active: {
      get() {
        return this.$store.state.treeview.active;
      },
      set(value) {
        this.$store.commit("treeview/updateActive", value);
      },
    },
    selectedTree: {
      get() {
        return this.$store.state.treeview.selectedTree;
      },
      set(value) {
        this.$store.commit("treeview/updateSelectedTree", value);
      },
    },
  },
  watch: {
    selections: function (newSelections, oldSelections) {
      oldSelections
        .filter((item) => newSelections.indexOf(item) < 0)
        .forEach((item) => this.changeVisibility(item, false));
      newSelections
        .filter((item) => oldSelections.indexOf(item) < 0)
        .forEach((item) => this.changeVisibility(item, true));
    },
  },
  mounted() {
    this.left = this.$el.getBoundingClientRect().width;
    this.top = this.$el.getBoundingClientRect().height;
  },
  methods: {
    ...mapActions("network", ["call"]),
    changeVisibility(id, value) {
      this.call({
        command: "geode.actor.visibility",
        args: [id, value],
      });
      this.$store.dispatch("view/setVisibility", { id, value });
    },
    openContextualMenu(event, item) {
      if (!item.type) {
        return;
      }
      this.selectedItem = item;
      this.menuPosition = {
        x: this.left + event.x + 50,
        y: this.top - event.y,
      };
      this.displayMenu = true;
    },
  },
};
</script>

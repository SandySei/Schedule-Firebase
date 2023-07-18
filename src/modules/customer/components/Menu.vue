<script setup>
import { useStore } from "@/composables/useStore";

const { content } = useStore();
const { auth } = content;

</script>

<template>
  <v-toolbar
    fixed-tabs
    class="mini-menu d-flex justify-space-evenly alising-center w-100 bg-grey-lighten-2"
  >
    <router-link to="/customer" class="w-100 h-100 d-flex">
      <img src="/src/assets/Schedule-text.png"/>
    </router-link>

    <router-link to="/" class="w-100 h-100">
      <v-tab
        @click="content.auth.logout()"
        class="text-red-darken-4 w-100 h-100"
        value="Entrar"
      >
        Sair
      </v-tab>
    </router-link>

  </v-toolbar>
</template>

<style scoped>
.mini-menu {
  height: 55px;
}

img {
  width: auto;
  height: 40px;
  margin-top: 10px;
  margin-left: 15px;
}
</style>

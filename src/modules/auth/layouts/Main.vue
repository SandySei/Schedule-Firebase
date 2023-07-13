<template>
  <v-container class="bg-grey-lighten-4 mt-9 w-75 d-flex flex-row box-grey-fix  ">
    <v-img
      class="w-50 pa-16"
      :width="300"
      aspect-ratio="1/3"
      src="/src/assets/Schedule-home.png"
    ></v-img>

    <div class="w-50 pa-16">
      <v-toolbar
        fixed-tabs
        class="mini-menu d-flex justify-space-evenly alising-center w-100 bg-grey-lighten-2" 
      >
        <router-link to="/" class="w-100 h-100">
          <v-tab class="text-blue-accent-4 w-100 h-100" value="Entrar"> Entrar </v-tab>
        </router-link>
        <router-link to="/register" class="w-100 h-100">
          <v-tab class="text-blue-accent-4 w-100 h-100" value="Cadastro">
            Cadastro
          </v-tab>
        </router-link>
      </v-toolbar>
      <router-view
        @snackbar="sendSnackbarEvent"
        class="pa-10 menu bg-grey-lighten-3"
      ></router-view>
    </div>
  </v-container>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["snackbar"]);
const props = defineProps({
  isSnackBarOpen: Boolean,
});
const sendSnackbarEvent = (message) => {
  emit("snackbar", message)
}
</script>

<style scoped>
.mini-menu {
  height: 50px;
}

.menu {
  height: 650px;
}

.box-grey-fix {
  height: 850px;
}
</style>

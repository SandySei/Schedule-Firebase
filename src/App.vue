<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "./composables/useStore";
import { ref } from "vue";
import router from "./router";

const { content } = useStore();
const { auth } = content;

const isSnackBarOpen = ref(false);
const snackbarText = ref("");

function setupSnackbar(message) {
  isSnackBarOpen.value = true;
  snackbarText.value = message;
}

onMounted(() => {
  auth.isLogged();

  const user = JSON.parse(
    localStorage.getItem(
      "firebase:authUser:AIzaSyD0ArpOC15GJ7Tg0UwnqopYQ64gfK1kxBY:[DEFAULT]"
    )
  );

  if (user) {
    auth.setUser(user);
  }
});
</script>

<template>
  <router-view
    @snackbar="setupSnackbar"
    :isSnackBarOpen="isSnackBarOpen"
  ></router-view>
  <v-snackbar :timeout="3000" color="red-darken-4" v-model="isSnackBarOpen">
    {{ snackbarText }}
  </v-snackbar>
</template>

<style>
body{
  background-image: url(./assets/fundo.jpg);
  background-size: cover;
}
</style>
<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "./composables/useStore";
import { ref } from "vue";

const { content } = useStore();
const { auth } = content;

const isSnackBarOpen = ref(false);
const snackbarText = ref("");

function setupSnackbar(message) {
  isSnackBarOpen.value = true;
  snackbarText.value = message;
}

onMounted(() => {
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
    v-on:snackbar="setupSnackbar"
    :isSnackBarOpen="isSnackBarOpen"
  ></router-view>
  <v-snackbar :timeout="2000" color="red" v-model="isSnackBarOpen">
    {{ snackbarText }}
  </v-snackbar>
</template>

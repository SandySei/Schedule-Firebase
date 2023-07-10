<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "./composables/useStore";

const { content } = useStore();
const { auth } = content;
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
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />
  </header>

  <RouterView />
</template>
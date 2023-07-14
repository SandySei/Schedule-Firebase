<template>
  <!--Template e script prontos para uso em view futurra  -->
  <v-btn
    class="ma-2"
    color="red-darken-4"
    @click="content.auth.logout()"
    icon="mdi-logout"
  ></v-btn>
</template>

<script>
import { useStore } from "@/composables/useStore";

const { content } = useStore();
const { auth } = content;

</script>
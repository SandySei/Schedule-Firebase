<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/composables/useStore";
const { content } = useStore();
const { auth } = content;

const router = useRouter();

const email = ref("");
const password = ref("");

async function handleSignIn() {
  const result = await auth.signIn(email.value, password.value);

  if (!result) {
    alert("email ou senha incorretos");
    return;
  }

  router.push("/items/");
}
</script>

<template>
  <main>
   
    <input type="email" v-model="email" />
    <input type="password" v-model="password" />
    <button @click="handleSignIn">Logar</button>
  </main>
</template>

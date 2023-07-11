<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/composables/useStore";

const { content } = useStore();
const { auth } = content;

const emit = defineEmits(["snackbar"]);

const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

async function handleSignIn() {
  const result = await auth.signIn(email.value, password.value);

  if (!result) {
    emit("snackbar", "E-mail ou senha incorretos");
    return;
  }

  router.push("/items/");
}
</script>

<template>
  <main>
    <v-text-field v-model="email" label="E-mail"></v-text-field>

    <v-text-field
      v-model="password"
      label="Senha"
      :type="showPassword ? 'text' : 'password'"
    ></v-text-field>

    <v-checkbox
      v-model="showPassword"
      label="Ver senha"
      color="grey"
    ></v-checkbox>

    <v-btn
      color="grey-darken-2"
      type="submit"
      @click="handleSignIn"
      block
      class="mt-2"
      >Entrar</v-btn
    >
  </main>
</template>

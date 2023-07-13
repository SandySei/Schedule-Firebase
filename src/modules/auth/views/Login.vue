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

  if (result.role == "customer") {
    emit("snackbar", "Login efetuado com sucesso!");
    router.push("/customer");
  } else {
    emit("snackbar", "Login efetuado com sucesso!");
    router.push("/realtor");
  }
}
</script>

<template>
  <v-container class="d-flex justify-center flex-column align-self-center ">
    <div class=" animate__animated animate__backInDown">
      <v-text-field
        v-model="email"
        variant="underlined"
        clearable
        label="E-mail"
      ></v-text-field>

      <v-text-field
        v-model="password"
        variant="underlined"
        clearable
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
      <p class="pt-6 pl-1 text-grey-darken-1">
        Cadastre-se
        <router-link
          class="text-blue-accent-4 text-decoration-none"
          to="/register"
          >aqui!</router-link
        >
      </p>
    </div>
  </v-container>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/composables/useStore";

const { content } = useStore();
const { auth } = content;

const emit = defineEmits(["snackbar"]);
const props = defineProps({
  isSnackBarOpen: Boolean,
});

const router = useRouter();
const fullName = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const isFormValid = ref(true);

const formatText = () => {
  let words = fullName.value.split(" ");
  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase();
    if (i !== 0 && i !== words.length - 1) {
      if (["de", "da", "dos", "e", "do"].includes(word)) {
        words[i] = word;
        continue;
      }
    }
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  fullName.value = words.join(" ");
};

const fullNameRules = (value) => {
  if (!/\S\s\S/.test(value)) {
    return "Por favor coloque seu nome completo";
  }
  return true;
};

const phoneRules = (value) => {
  if (value.length !== 11) {
    return "Insira um número válido";
  }
  return true;
};

const emailRules = (value) => {
  if (!/^.+$/.test(value)) return "Campo Obrigatório";
  if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)) {
    return "Este não é um E-mail válido";
  }
  if (/\s/.test(value)) return "O E-mail não pode conter espaços";
  if (/@.*@|\b.com.*\.com\b/.test(value))
    return "Não é possivel logar com dois E-mails";
  return true;
};

const passwordRules = (value) => {
  if (!/^.+$/.test(value)) return "Campo Obrigatório";
  if (!/.*[0-9]/.test(value)) {
    return "A senha precisa de um número";
  }
  if (!/.*[a-z]/.test(value)) {
    return "A senha precisa de pelo menos uma letra minúscula";
  }
  if (!/.*[A-Z]/.test(value)) {
    return "A senha precisa de pelo menos uma letra maiúscula";
  }
  if (!/.*[*!#@().$%&]/.test(value)) {
    return "A senha precisa de pelo menos um caractere especial";
  }
  if (!/^[a-zA-Z0-9*!#@().$%&]{8,}$/.test(value)) {
    return "Sua senha precisa ter pelo menos 8 caracteres";
  }
  return true;
};

const isPasswordMatch = (value) => {
  if (!/^.+$/.test(value)) return "Campo Obrigatório";
  if (password.value == value) return true;
  return "As senhas devem ser iguais";
};

async function handleSubmit(event) {
  event.preventDefault();
  if (!isFormValid.value) {
    return;
  }

  const result = await auth.signUp({
    email: email.value,
    password: password.value,
    name: fullName.value,
    phone: phone.value,
  });
  if (!result) {
    emit("snackbar", "Problemas no cadastro");
    return;
  }
  router.push("/");
}
</script>

<template>
  <v-form fast-fail @submit.prevent v-model="isFormValid">
    <v-text-field
      v-model="fullName"
      label="Nome Completo"
      :rules="[fullNameRules]"
      @blur="formatText"
    ></v-text-field>

    <v-text-field
      label="Numero de Telefone"
      :rules="[phoneRules]"
      type="number"
      v-model="phone"
    ></v-text-field>

    <v-text-field v-model="email" label="E-mail" :rules="[emailRules]">
    </v-text-field>

    <v-text-field
      v-model="password"
      label="Senha"
      :type="showPassword ? 'text' : 'password'"
      :rules="[passwordRules]"
    ></v-text-field>

    <v-text-field
      v-model="confirmPassword"
      label="Confirme sua Senha"
      :type="showPassword ? 'text' : 'password'"
      :rules="[isPasswordMatch]"
    ></v-text-field>

    <v-checkbox
      v-model="showPassword"
      label="Ver senhas"
      color="grey"
    ></v-checkbox>

    <v-btn
      :disabled="!isFormValid"
      color="grey-darken-2"
      type="submit"
      block
      class="mt-2"
      @click="handleSubmit"
      >Cadastrar</v-btn
    >
  </v-form>
</template>

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

const roles = [
  {
    value: "customer",
    label: "Comprador",
  },
  {
    value: "realtor",
    label: "Corretor",
  },
];

const router = useRouter();
const fullName = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("");
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

const selectRule = (v) => {
  if (!v) return "Selecione uma opção";
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
    role: role.value,
  });
  if (!result) {
    emit("snackbar", "Problemas no cadastro");
    return;
  }
  emit("snackbar", "Cadastro realizado com sucesso!");
  router.push("/");
}
</script>

<template>
  <v-form fast-fail @submit.prevent v-model="isFormValid">

    <div class="animate__animated animate__backInDown">
      <v-text-field
        v-model="fullName"
        variant="underlined"
        clearable
        label="Nome Completo"
        :rules="[fullNameRules]"
        @blur="formatText"
      ></v-text-field>

      <v-text-field
        label="Numero de Telefone"
        :rules="[phoneRules]"
        variant="underlined"
        clearable
        type="number"
        v-model="phone"
      ></v-text-field>

      <v-select
        :items="roles"
        item-title="label"
        item-value="value"
        variant="underlined"
        clearable
        label="Selecione"
        :rules="[selectRule]"
        v-model="role"
      ></v-select>

      <v-text-field
        v-model="email"
        variant="underlined"
        clearable
        label="E-mail"
        :rules="[emailRules]"
      >
      </v-text-field>

      <v-text-field
        v-model="password"
        label="Senha"
        variant="underlined"
        clearable
        :type="showPassword ? 'text' : 'password'"
        :rules="[passwordRules]"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        variant="underlined"
        clearable
        label="Confirme sua Senha"
        :type="showPassword ? 'text' : 'password'"
        :rules="[isPasswordMatch]"
      ></v-text-field>

      <v-checkbox-btn
        v-model="showPassword"
        label="Ver senhas"
        color="grey"
      ></v-checkbox-btn>

      <v-btn
        :disabled="!isFormValid"
        color="grey-darken-2"
        type="submit"
        block
        class="mt-2"
        @click="handleSubmit"
        >Cadastrar</v-btn
      >
      
    </div>
  </v-form>
</template>

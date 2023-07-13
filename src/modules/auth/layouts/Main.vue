<template>
  <router-view @snackbar="sendSnackbarEvent"></router-view>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["snackbar"]);
const props = defineProps({
  isSnackBarOpen: Boolean,
});
</script>

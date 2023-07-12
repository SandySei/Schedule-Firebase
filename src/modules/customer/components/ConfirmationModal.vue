<script>
export default {
  props: {
    modalTitle: String,
    name: String,
    person: String,
    date: String,
    time: String,
    open: Boolean,
  },
  emits: ["close-modal", "submit"],
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
    submitInfo() {
      this.$emit("submit");
      this.closeModal();
    },
  },
};
</script>


<template>
  <v-dialog :model-value="open" @click:outside="closeModal" width="900">
    <v-card>
      <v-card-title>{{ modalTitle }}</v-card-title>
      <v-card-text>
        <p>Lote: {{ name }}</p>
          <p>Corretor(a): {{ person }}</p>
          <p>Horário: {{ date }} - {{ time }}</p>
          <span><strong>Duração da visita: </strong>1 hora</span>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submitInfo">Confirmar</v-btn>
        <v-btn @click="closeModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

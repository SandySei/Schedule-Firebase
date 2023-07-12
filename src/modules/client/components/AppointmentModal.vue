<script>
export default {
  props: {
    modalTitle: String,
    text: String,
    open: Boolean,
  },
  data() {
    return {
      selectedDateTime: null,
      showDetails: "",
    };
  },
  emits: ["close-modal", "submit"],
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
    resetDetails() {
      this.showDetails = "";
    },
    submitInfo(){
        this.$emit("submit", this.selectedDateTime );
        this.closeModal();
    }
  },
};
</script>

<template>
  <v-dialog :model-value="open" @click:outside="closeModal" width="900">
    <v-card>
      <v-card-title>{{ modalTitle }}</v-card-title>
      <v-card-text>
        {{ text }}
        <div class="my-5">
          <v-date-picker
            class="mx-7 bg-blue-lighten-5"
            v-model="selectedDateTime"
            :mode="'dateTime'"
            is24hr
          ></v-date-picker>
        </div>
        <p>Data escolhida: {{ selectedDateTime }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="showDetails = 'appointmentDetails'">Confirmar</v-btn>
        <v-btn @click="closeModal">Cancelar</v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <template v-if="showDetails === 'appointmentDetails'">
        <span>Deseja confirmar este horário?</span>
        <p>{{ selectedDateTime }}</p>
        <v-btn @click="submitInfo">Confirmar</v-btn>
        <v-btn @click="resetDetails">Cancelar</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

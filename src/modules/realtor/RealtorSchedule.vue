<script>
import { getDocs, collection, doc } from "firebase/firestore";
import { db } from "../../firebase.config.js";

export default {
  data() {
    return {
      selectedTime: "",
      schedules: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ],
      realtorNames: [
        "Eva Mendes",
        "Will Smith",
        "Carlos Alberto",
        "Harry Potter",
        "Hermione Granger",
        "Rowena Ravenclaw",
      ],
      selectedDate: null,
    };
  },
  methods: {
    getFormatDate(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return `${date.getUTCDate()}/${
        date.getUTCMonth() + 1
      }/${date.getUTCFullYear()}`;
    },

    async create(payload) {
      const docRef = await addDoc(collection(db, "appointments"), payload);
      return docRef;
    },
    async addAppointment() {
      const payload = {
        Property: this.selectedCard?.landName,
        Realtor: this.selectedRealtor,
        Date: this.selectedDate,
        Time: this.selectedTime,
      };
      await this.create(payload);
      this.$refs.form.reset();
      this.$router.push({ name: "realtorLanding" });
    },
  },

};
</script>

<template>
  <v-container class="bg-grey w-75">
    <h1 class="text-center">Organize sua agenda de horários</h1>

    <div class="d-flex align-center justify-center my-5">
      <v-card class="d-flex align-center justify-center bg-blue-lighten-5 mx-7">
        <v-date-picker
          class="ml-7 w-50"
          v-model.string="selectedDate"
          :mode="'date'"
        ></v-date-picker>

        <v-chip-group
          class="d-flex justify-center"
          v-model="selectedTime"
          selected-class="text-deep-purple-accent-4"
          mandatory
        >
          <v-chip
            v-for="time in schedules"
            :key="time"
            :value="time"
            size="x-large"
            rounded="sm"
            class="mx-4 my-5"
            >
            {{ time }}
          </v-chip>
        </v-chip-group>
      </v-card>
    </div>
     
      <v-form
        class="w-50 ml-5 mr-8"
        @submit.prevent="addAppointment"
        ref="form"
        v-model="isFormValid"
      >
        <v-card class="w-100 pl-5 py-4 bg-blue-lighten-5 d-flex flex-column">
          <h3 class="text-center">Detalhes do serviço</h3>
          <br />
          <p>Lote: {{ selectedCard?.landName }}</p>
          <p>Corretor(a): {{ selectedRealtor }}</p>
          <p>Horário: {{ getFormatDate(selectedDate) }} - {{ selectedTime }}</p>
          <span><strong>Duração da visita: </strong>1 hora</span>
          <v-divider class="mb-4"></v-divider>
          <span
            ><strong>Escolha por quem gostaria de ser atendido:</strong></span
          >
          <v-select
            :items="realtorNames"
            v-model="selectedRealtor"
            placeholder="Escolha o corretor"
            label="Membro da equipe"
            class="mt-3 px-16"
            color="blue"
            required
          ></v-select>
          <div class="d-flex flex-column align-center justify-center">
            <v-btn :width="270" @click="openModal">Fechar agenda</v-btn>
          </div>
        </v-card>
      </v-form>
      <ConfirmationModal
        modal-title="As informações abaixo estão corretas?"
        :name="selectedCard?.landName"
        :person="selectedRealtor"
        :date="getFormatDate(selectedDate)"
        :time="selectedTime"
        :open="showModal"
        @closeModal="showModal = false"
        @submit="addAppointment"
      />
  </v-container>
</template>

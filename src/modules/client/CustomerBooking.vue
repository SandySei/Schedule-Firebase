<script>
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../firebase.config.js";
import LocationCard from "@/modules/client/components/LocationCards.vue";
import AppointmentModal from "@/modules/client/components/AppointmentModal.vue";

export default {
  data() {
    return {
      selection: "09",
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
      card: {
        image:
          "https://media.staticontent.com/media/pictures/04641818-297a-4f28-b635-b15e2fb31087",
        landName: "Residencial Belmond",
      },
      realtorNames: [
        "Eva Mendes",
        "Will Smith",
        "Carlos Alberto",
        "Harry Potter",
        "Hermione Granger",
        "Rowena Ravenclaw",
      ],
      selectedRealtor: "",
      selectedDate: null,
      selectedTime: null,
    };
  },
  components: {
    LocationCard,
    AppointmentModal,
  },
  methods: {
    async create(payload) {
      const docRef = await addDoc(collection(db, "customers"), payload);
      return docRef;
    },
    async addAppointment() {
      const payload = {
        Property: this.card.landName,
        Realtor: this.selectedRealtor,
        Date: this.selectedDate,
        Time: this.selection,
      };
      await this.create(payload);
    },
  },
};
</script>

<template>
  <v-container class="bg-grey w-75">
    <h1 class="text-center">Agende seu horário</h1>

    <h3>Escolha o local:</h3>
    <div class="d-flex align-center mt-4">
      <LocationCard
        title="Residencial Belmonte"
        description="Fácil acesso ao Centro de Nova Hartz e RS-239, pavimentação em blocos de concreto em terreno plano. Rede de água/esgoto e pluvial, iluminação pública área de lazer e institucional."
        :image="card.image"
        land="143m²"
        delivery="12 meses"
        type="Residencial"
      />
      <LocationCard
        title="Loteamento Gregório"
        description="Loteamento com ruas ecologicamente corretas em terreno plano, com rápido acesso a estação Unisinos do Trensurb e ao centro de Sapucaia do Sul."
        :image="card.image"
        land="1.322 m²"
        delivery="15 meses"
        type="Comercial"
      />
      <LocationCard
        title="Condomínio Reserva Allameda"
        description="Tem uma boa localização, fácil acesso ao centro próximo a estação rodoviária de Portão, e com diversos serviços essenciais e opções de lazer."
        :image="card.image"
        land="300m²"
        delivery="20 meses"
        type="Residencial"
      />
    </div>
    <v-divider></v-divider>

    <div class="d-flex align-center justify-center my-5">
      <v-card class="d-flex align-center justify-center bg-blue-lighten-5 mx-7">
        <v-date-picker
          class="ml-7 w-50"
          v-model="selectedDate"
          :mode="'date'"
        ></v-date-picker>

        <v-chip-group
          class="d-flex justify-center"
          v-model="selection"
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

      <v-card
        class="w-50 ml-5 mr-8 pl-5 py-4 bg-blue-lighten-5 d-flex flex-column"
      >
        <h3 class="text-center">Detalhes do serviço</h3>
        <br />
        <p>Lote: {{ card.landName }}</p>
        <p>Corretor(a): {{ selectedRealtor }}</p>
        <p>Horário: {{ selection }}</p>
        <p>Dia: {{ selectedDate }}</p>
        <span><strong>Duração da visita: </strong>1 hora</span>
        <v-divider class="mb-4"></v-divider>
        <span><strong>Escolha por quem gostaria de ser atendido:</strong></span>
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
          <v-btn :width="270" @click="addAppointment">Agendar</v-btn>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

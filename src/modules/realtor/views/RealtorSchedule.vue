<script>
import { getDocs, addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { getAuth } from "firebase/auth";
import ConfirmationModal from "@/modules/customer/components/ConfirmationModal.vue";

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
      selectedDate: null,
      bookingStatus: "Pendente",
      requester: "",
      isFormValid: false,
      showModal: false, 
      realtorBooking: "Horário reservado pelo corretor",
    };
  },
  components:{
    ConfirmationModal,
  },
  methods: {
    openModal() {
      if (this.selectedDate && this.selectedTime) {
        this.showModal = true;
      } else {
        alert("Por favor, selecione todas as opções");
      }
    },
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
      const auth = getAuth();
      const user = auth.currentUser;
      const displayName = user.displayName;

      const payload = {
        Property: this.realtorBooking,
        Realtor: "n/a",
        Date: this.selectedDate,
        Time: this.selectedTime,
        Status: this.bookingStatus,
        Requester: displayName,
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
    <h1 class="text-center">Agende um novo horário</h1>

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
      class="w-100 ml-5 mr-8 d-flex justify-center"
      @submit.prevent="addAppointment"
      ref="form"
      v-model="isFormValid"
    >
      <v-card class="w-25 pl-5 py-4 bg-blue-lighten-5 d-flex flex-column">
        <h3 class="text-center">Travar agenda</h3>
        <br />
        <span
          ><strong>Data: </strong>{{ getFormatDate(selectedDate) }} -
          {{ selectedTime }}</span
        >
        <v-divider class="mb-4"></v-divider>
        <div class="d-flex flex-column align-center justify-center">
          <v-btn :width="270" @click="openModal">Fechar agenda</v-btn>
        </div>
      </v-card>
    </v-form>
    <ConfirmationModal
      modal-title="Gostaria de travar este horário?"
      :date="getFormatDate(selectedDate)"
      :time="selectedTime"
      :open="showModal"
      @closeModal="showModal = false"
      @submit="addAppointment"
    />
  </v-container>
</template>

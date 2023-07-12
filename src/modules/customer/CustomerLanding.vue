<script>
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase.config.js";

export default {
  data() {
    return {
      appointments: [],
    };
  },
  async mounted() {
    await this.getAppointment();
  },
  methods: {
    async getAppointment() {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      this.appointments = querySnapshot.docs.map((doc) => doc.data());
      const data = doc.data();
    data.id = doc.id;
    return data;
    },
    getFormatDate(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return `${date.getUTCDate()}/${
        date.getUTCMonth() + 1
      }/${date.getUTCFullYear()}`;
    },
  },
};
</script>

<template>
  <v-container class="bg-grey w-75">
    <div class="d-flex align-center justify-end">
       Clque para agendar visita <v-icon>mdi-arrow-right</v-icon>
        <v-btn icon="mdi-plus" size="x-large" @click="$router.push({ name: 'booking' });"></v-btn>
    </div>
    <h1 class="text-center">Confira seus agendamentos</h1>
    <div class="d-flex align-center justify-center mt-16 mb-5">
    <v-card v-for="appointment in appointments" :key="appointment.id" class="mx-auto" max-width="300">
      <v-list>
        <v-list-item>
          <v-list-item>{{ appointment.Property }}</v-list-item>
          <v-list-item>{{ appointment.Realtor }}</v-list-item>
          <v-list-item>{{ getFormatDate(appointment.Date) }} - {{ appointment.Time }}</v-list-item>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
  </v-container>
</template>

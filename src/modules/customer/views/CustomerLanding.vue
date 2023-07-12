<script>
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../../firebase.config";

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
    <v-card class="mx-auto" max-width="300">
      <v-list>
        <v-list-item v-for="appointment in appointments" :key="appointment.id">
          <v-list-item>{{ appointment.Property }}</v-list-item>
          <v-list-item>{{ appointment.Realtor }}</v-list-item>
          <v-list-item>{{ appointment.Time }}</v-list-item>
          <v-list-item>{{ appointment.Date }}</v-list-item>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { getDocs, collection, doc } from "firebase/firestore";
import { db } from "../../../../firebase.config";

export default {
  data() {
    return {
      appointments: [],
    };
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
  mounted() {
    this.getAppointment();
  },
};
</script>

<template>
  <v-container class="bg-grey w-75">
    <div class="d-flex align-center justify-end">
      Adicione um horário na sua agenda <v-icon>mdi-arrow-right</v-icon>
      <v-btn
        icon="mdi-plus"
        size="x-large"
        @click="$router.push({ name: 'booking' })"
      ></v-btn>
    </div>
    <h1 class="text-center">Confira sua agenda</h1>

      <v-table fixed-header class="mt-5" >
        <thead>
          <tr>
            <th class="text-left">Solicitante</th>
            <th class="text-left">Loteamento escolhido</th>
            <th class="text-left">Data escolhida</th>
            <th class="text-left">Horário</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>Rafaella</td>
            <td>{{ appointment.Property }}</td>
            <td>{{ getFormatDate(appointment.Date) }}</td>
            <td>{{ appointment.Time }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
</template>

<script>
import {
  onSnapshot,
  updateDoc,
  deleteDoc,
  collection,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";

export default {
  data() {
    return {
      appointments: [],
    };
  },
  computed: {
  sortedAppointments() {
    return this.appointments.sort((a, b) => {
      const statusA = a.Status?.toLowerCase();
      const statusB = b.Status?.toLowerCase();
      if (statusA < statusB) return 1;
      if (statusA > statusB) return -1;

      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      const timeA = a.Time?.toLowerCase();
      const timeB = b.Time?.toLowerCase();
      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;

      return 0;
    });
  },
  },
  methods: {
    async getAppointment() {
      const querySnapshot = await onSnapshot(
        collection(db, "appointments"),
        (snapshot) => {
          this.appointments = snapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
          });
        }
      );
    },
    async updateAppointmentStatus(appointmentId, status) {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { Status: status });
    },
    async deleteAppointment(appointmentId) {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await deleteDoc(appointmentRef);
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
        @click="$router.push({ name: 'schedule' })"
      ></v-btn>
    </div>
    <h1 class="text-center">Confira sua agenda</h1>

    <v-table fixed-header class="mt-5">
      <thead>
        <tr>
          <th class="text-left">Data escolhida</th>
          <th class="text-left">Horário</th>
          <th class="text-left">Loteamento escolhido</th>
          <th class="text-left">Solicitante</th>
          <th class="text-left">Status da visita</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in sortedAppointments" :key="appointment.id">
          <td>{{ getFormatDate(appointment.Date) }}</td>
          <td>{{ appointment.Time }}</td>
          <td>{{ appointment.Property }}</td>
          <td>{{appointment.Requester}}</td>
          <td>
            <v-checkbox-btn
              :label="appointment.Status"
              :model-value="appointment.Status == 'concluído'"
              @change="
                updateAppointmentStatus(
                  appointment.id,
                  $event.target.checked ? 'concluído' : 'pendente'
                )
              "
            ></v-checkbox-btn>
          </td>
          <td>
            <div class="btn-container">
              <v-btn
                expand-on-hover
                variant="flat"
                @click="deleteAppointment(appointment.id)"
              >
                <span class="pr-3"
                  ><v-icon color="red-darken-4">mdi-close</v-icon></span
                >
                <span class="text text-body-2 text-red-darken-4">Excluir</span>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<style scoped>
.btn-container:hover {
  transition: 1s;
}
.text {
  transition: 1s;
  width: 0px;
  overflow: hidden;
}
.btn-container:hover .text {
  display: flex;
  width: 47px;
  align-content: center;
}
</style>

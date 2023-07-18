<script>
import {
  onSnapshot,
  updateDoc,
  deleteDoc,
  collection,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";
import Menu from "@/modules/realtor/components/Menu.vue";

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

  components: {
    Menu,
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
  <Menu class="mb-8 elevation-3"></Menu>

  <v-container
    class="bg-grey-lighten-3 mb-8 elevation-2 w-75 d-flex align-center flex-column justify-center"
  >
    <h2 class="text-center mb-4">Confira sua agenda:</h2>

    <v-card
      v-for="appointment in sortedAppointments"
      :key="appointment.id"
      class="w-75 mb-5 elevation-0 rounded-0 d-flex align-center flex-row justify-center"
    >
      <div class="w-100">
        <v-card-title>{{ appointment.Requester }}</v-card-title>
        <v-card-text
          ><strong>Edificação:</strong> {{ appointment.Property.landName }}
          <br />
          <strong>Endereço:</strong>{{ appointment.Property.landDescription }}
          <br />
          <strong>Agendado para dia </strong>
          {{ getFormatDate(appointment.Date) }}
          <strong>às </strong>
          {{ appointment.Time }}
        </v-card-text>
      </div>

      <div class="w-25">
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

        <div class="btn-container d-flex align-end justify-end">
          <v-btn
            class="rounded-pill"
            expand-on-hover
            variant="flat"
            @click="deleteAppointment(appointment.id)"
          >
            <p class="text text-body-2 text-grey-darken-2">Excluir</p>

            <span
              ><v-icon size="x-large" color="grey-darken-2"
                >mdi-close</v-icon
              ></span
            >
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.rounded-pill {
  height: 60px;
}
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
  width: 50px;
  align-content: center;
}

h2 {
  font-size: 2rem;
}

v-card {
  height: 500px;
}
</style>

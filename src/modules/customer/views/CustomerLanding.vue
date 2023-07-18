<script>
import { getDocs, collection, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import Menu from "@/modules/customer/components/Menu.vue";
import { doc } from "firebase/firestore";

export default {
  data() {
    return {
      appointments: [],
    };
  },
  async mounted() {
    await this.getAppointment();
  },
  components: {
    Menu,
  },
  methods: {
    async getAppointment() {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      this.appointments = await Promise.all(
        querySnapshot.docs.map(async (appointmentRef) => {
          const data = appointmentRef.data();
          data.id = appointmentRef.id;
          if (!data.Realtor) return data;
          const realtorRef = await getDoc(doc(db, "users", data.Realtor));
          const realtorData = realtorRef.data();
          data.RealtorName = realtorData.name;
          return data;
        })
      );
      this.sortAppointments(); // Ordena os agendamentos por data mais próxima
    },

    sortAppointments() {
      const currentDate = new Date();
      this.appointments.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);

        if (dateA >= currentDate && dateB < currentDate) {
          return -1; // Mantém a data atual no topo
        } else if (dateA < currentDate && dateB >= currentDate) {
          return; // Move a data atual para cima
        }
        return dateA - dateB;
      });
    },

    async deleteAppointment(appointmentId) {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await deleteDoc(appointmentRef);
      await this.getAppointment();
      this.$emit("snackbar", "Agendamento desmarcado com sucesso!");
    },

    getFormatDate(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return `${date.getUTCDate()}/${
        date.getUTCMonth() + 1
      }/${date.getUTCFullYear()}`;
    },
    isPastDate(date) {
      const currentDate = new Date();
      const appointmentDate = new Date(date);
      return appointmentDate < currentDate;
    },
  },
  mounted() {
    this.getAppointment();
  },
};
</script>

<template>
  <Menu class="mb-8 elevation-3"></Menu>

  <v-container class="bg-grey-lighten-3 mb-8 elevation-2 w-75">
    <div class="d-flex flex-row align-center justify-center w-100">
      <div class="w-25"></div>
      <h2 class="text-center w-50">Seus agendamentos:</h2>
      <div
        class="btn-container d-flex align-end justify-end mr-2 mt-2 w-25"
        @click="$router.push({ name: 'booking' })"
      >
        <v-btn class="rounded-pill" expand-on-hover variant="flat">
          <p class="text text-body-2 text-grey-darken-2">
            Clique para agendar visita
          </p>
          <span
            ><v-icon size="x-large" color="grey-darken-2"
              >mdi-plus</v-icon
            ></span
          >
        </v-btn>
      </div>
    </div>

    <div class="d-flex align-center flex-column justify-center mt-8 w-100">
      <v-card
        v-for="appointment in appointments"
        :key="appointment.id"
        :class="{ 'past-date': isPastDate(appointment.Date) }"
        class="w-75 mb-5 elevation-0 rounded-0 d-flex align-center flex-row justify-center"
      >
        <div class="w-75">
          <v-card-title>{{ appointment.Property.landName }}</v-card-title>
          <v-card-subtitle>{{
            appointment.Property.landDescription
          }}</v-card-subtitle>

          <v-card-text
            ><strong>Corretor:</strong> {{ appointment.RealtorName }} <br />
            <strong>Agendado para dia</strong>
            {{ getFormatDate(appointment.Date) }}
            <strong>às</strong>
            {{ appointment.Time }}
          </v-card-text>
        </div>

        <div
          class="btn-container d-flex align-end justify-end mr-2 mt-2 w-25"
          @click="deleteAppointment(appointment.id)"
        >
          <v-btn class="rounded-pill" expand-on-hover variant="flat">
            <p class="text text-body-2 text-grey-darken-2">
              Cancelar Agendamento
            </p>
            <span
              ><v-icon size="x-large" color="grey-darken-1"
                >mdi-close</v-icon
              ></span
            >
          </v-btn>
        </div>
      </v-card>
    </div>
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
  width: 160px;
  align-content: center;
}

.past-date {
  background-color: #b71c1c;
}

h2 {
  font-size: 2rem;
}
</style>

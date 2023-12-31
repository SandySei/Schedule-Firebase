<script>
import {
  getDocs,
  collection,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";
import Menu from "@/modules/customer/components/Menu.vue";
import { doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      appointments: [],
    };
  },
  components: {
    Menu,
  },
  methods: {
    async getAppointment() {
      const auth = getAuth();
      const { displayName } = auth.currentUser;

      const customerAppointmentsSnapshot = await getDocs(
        query(
          collection(db, "appointments"),
          where("Requester", "==", displayName)
        )
      );

      this.appointments = await Promise.all(
        customerAppointmentsSnapshot.docs.map(async (appointmentDoc) => {
          const appointmentData = {
            id: appointmentDoc.id,
            ...appointmentDoc.data(),
          };

          const realtorDoc = await getDoc(
            doc(db, "users", appointmentData.Realtor)
          );

          return {
            ...appointmentData,
            Realtor: { id: realtorDoc.id, ...realtorDoc.data() },
          };
        })
      );
      this.sortAppointments(); // Ordena os agendamentos por data mais próxima
    },

    sortAppointments() {
      const currentDate = new Date();

      this.appointments.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);

        if (dateA.getDate() < currentDate.getDate()) return 1;
        if (dateB.getDate() < currentDate.getDate() && dateA > dateB) return -1;
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
      return appointmentDate.getDate() < currentDate.getDate();
    },
    isToday(date) {
      const currentDate = new Date();
      const appointmentDate = new Date(date);
      return appointmentDate.getDate() == currentDate.getDate();
    },
  },
  mounted() {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) return;
      this.getAppointment();
    });
  },
};
</script>

<template>
  <Menu class="mb-8 elevation-3"></Menu>

  <v-container class="cardprincipal mb-8 elevation-2 w-75">
    <div class="d-flex flex-row align-center justify-center w-100">
      <div class="w-25"></div>
      <h2 class="text-center w-50">Seus agendamentos:</h2>
      <div
        class="btn-container texto1 d-flex align-end justify-end mr-2 mt-2 w-25"
        @click="$router.push({ name: 'booking' })"
      >
        <v-btn class="rounded-pill elevation-1" expand-on-hover variant="flat">
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
        :class="{
          'past-date': isPastDate(appointment.Date),
          today: isToday(appointment.Date),
        }"
        class="cardcominfo w-75 mb-5 elevation-0 rounded-0 d-flex align-center flex-row justify-center"
      >
        <div class="w-75 d-flex align-center">
          <div><img :src="appointment.Property.landImage" class="ml-4 mt-2" /></div>

          <div>
            <v-card-title>{{ appointment.Property.landName }}</v-card-title>
            <v-card-subtitle>
              <strong
                >{{ appointment.Property.landDescription }}
              </strong></v-card-subtitle
            >

            <v-card-text
              ><strong>Corretor:</strong> {{ appointment.Realtor.name }} <br />
              <strong>Telefone: </strong> {{ appointment.Realtor.phone }} <br />
              <strong>Agendado para dia</strong>
              {{ getFormatDate(appointment.Date) }}
              <strong>às</strong>
              {{ appointment.Time }}
            </v-card-text>
          </div>
        </div>

        <div
          class="btn-container d-flex align-end justify-end mt-2 w-25 mr-6"
          @click="deleteAppointment(appointment.id)"
        >
          <v-btn
            class="rounded-pill elevation-1"
            expand-on-hover
            variant="flat"
          >
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
.cardprincipal {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
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

img {
  width: 150px;
}
.btn-container:hover .text {
  display: flex;
  width: 168px;
  align-content: center;
}
.cardcominfo {
  background-color: #ffffffb1;
}
.past-date {
  background-color: #b71c1cb1;
}
.today {
  background-color: #1565c0b1;
}
h2 {
  font-size: 2rem;
}
</style>

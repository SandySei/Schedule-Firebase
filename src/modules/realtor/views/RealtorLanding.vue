<script>
import {
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";
import Menu from "@/modules/realtor/components/Menu.vue";
import { doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      //1 - pegar o nome do corretor autenticado da autenticação
      const auth = getAuth();
      const { displayName } = auth.currentUser;

      //2 - buscar os dados do corretor na coleção users, filtrando users por name
      const usersRef = await getDocs(
        query(collection(db, "users"), where("name", "==", displayName))
      );
      const realtorUserDoc = usersRef.docs[0];
      const realtorUserData = {
        id: realtorUserDoc.id,
        ...realtorUserDoc.data(),
      };

      //3 - buscar os appointments cujo campo Realtor é igual ao id do realtor encontrado no passo anterior
      const realtorAppointmentsSnapshot = await getDocs(
        query(
          collection(db, "appointments"),
          where("Realtor", "==", realtorUserData.id)
        )
      );

      //5 - salvar uma lista de appointments exclusivos do corretor com os dados do Requester em this.appointments
      this.appointments = await Promise.all(
        realtorAppointmentsSnapshot.docs.map(async (appointmentDoc) => {
          const appointmentData = {
            id: appointmentDoc.id,
            ...appointmentDoc.data(),
          };
          //4 - para cada appointment, buscar o usuario com nome igual ao campo Requester do appointment
          const requestersSnapshot = await getDocs(
            query(
              collection(db, "users"),
              where("name", "==", appointmentData.Requester)
            )
          );
          const requesterDocs = requestersSnapshot.docs[0];
          const requesterData = {
            id: requesterDocs.id,
            ...requesterDocs.data(),
          };

          return { ...appointmentData, Requester: { ...requesterData } };
        })
      );
      /*
      formato final
      {
        id:
        Property
        Realtor:
        Requester: {
          id:
          name:
          phone
        }
      }
      console.log(this.appointments);
      */
    },
    async updateAppointmentStatus(appointmentId, status) {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { Status: status });
      await this.getAppointment();
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
  <v-container
    class="cardprincipal mb-8 elevation-2 w-75 d-flex align-center flex-column justify-center"
  >
    <h2 class="text-center mb-4">Confira sua agenda:</h2>
    <v-card
      v-for="appointment in sortedAppointments"
      :key="appointment.id"
      :class="{
        'past-date': isPastDate(appointment.Date),
        today: isToday(appointment.Date),
      }"
      class="cardcominfo w-75 mb-5 elevation-0 rounded-0 d-flex align-center flex-column justify-center"
    >
      <div class="w-100 d-flex flex-row align-center">
        <div class="w-75 d-flex align-center">
          <div>
            <img :src="appointment.Property.landImage" class="ml-4 mt-2" />
          </div>

          <div>
            <v-card-title>{{ appointment.Requester.name }}</v-card-title>
            <v-card-subtitle
              ><strong
                >Telefone: {{ appointment.Requester.phone }}</strong
              ></v-card-subtitle
            >
            <v-card-text
              ><strong>Edificação:</strong> {{ appointment.Property.landName }}
              <br />
              <strong>Endereço:</strong
              >{{ appointment.Property.landDescription }}
              <br />
              <strong>Agendado para dia </strong>
              {{ getFormatDate(appointment.Date) }}
              <strong>às </strong>
              {{ appointment.Time }}
            </v-card-text>
          </div>
        </div>

        <div class="btn-container d-flex align-end justify-end w-25 pr-8">
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

      <div class="w-100 status elevation-1">
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
      </div>
    </v-card>
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

.status {
  background-color: #00000027;
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

img {
  width: 150px;
}
.rounded-pill {
  height: 60px;
}

.btn-container:hover {
  transition: 1s;
}

.barra {
  background-color: rgba(42, 42, 42, 0.157);
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

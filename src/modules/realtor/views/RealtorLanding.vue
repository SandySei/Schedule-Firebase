<script>
import {
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";
import Menu from "@/modules/realtor/components/Menu.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    class="bg-grey-lighten-3 mb-8 elevation-2 w-75 d-flex align-center flex-column justify-center"
  >
    <h2 class="text-center mb-4">Confira sua agenda:</h2>

    <v-card
      v-for="appointment in sortedAppointments"
      :key="appointment.id"
      class="w-75 mb-5 elevation-0 rounded-0 d-flex align-center flex-row justify-center"
    >
      <div class="w-100">
        <v-card-title>{{ appointment.Requester.name }}</v-card-title>
        <v-card-subtitle><strong>Telefone: {{ appointment.Requester.phone }}</strong></v-card-subtitle>
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

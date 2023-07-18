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

export default {
  data() {
    return {
      appointments: [],
    };
  },
  async mounted() {
    await this.getAppointment();
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
  <v-container class="bg-grey w-75">
    <h1 class="text-center my-9">Confira sua agenda</h1>

    <v-table fixed-header>
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
</style>

<script>
import {
  addDoc,
  getDocs,
  collection,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LocationCard from "@/modules/customer/components/LocationCards.vue";
import ConfirmationModal from "@/modules/customer/components/ConfirmationModal.vue";
import Menu from "@/modules/customer/components/Menu.vue";

export default {
  data() {
    return {
      selectedTime: "",
      schedules: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ],
      realtors: [],
      disabledDates: [
        {
          repeat: {
            weekdays: [1],
          },
        },
      ],

      showModal: false,
      selectedRealtorId: "",
      selectedDate: null,
      selectedCard: null,
      isFormValid: false,
      bookingStatus: "Pendente",
      Requester: "",
      cards: [],
    };
  },
  computed: {
    selectedRealtor() {
      //usar o selectedRealtorId para buscar em realtors
      const realtor = this.realtors.find(
        (realtor) => realtor.id == this.selectedRealtorId
      );
      return realtor;
    },
  },
  components: {
    LocationCard,
    ConfirmationModal,
    Menu,
  },
  methods: {
    openModal() {
      if (
        this.selectedCard &&
        this.selectedRealtorId &&
        this.selectedDate &&
        this.selectedTime
      ) {
        this.showModal = true;
      } else {
        this.$emit("snackbar", "Por favor, selecione TODAS as opções!");
      }
    },
    async checkConflict(realtorId, date, time) {
      return new Promise((resolve, reject) => {
        getDocs(collection(db, "appointments"))
          .then((querySnapshot) => {
            const appointments = querySnapshot.docs.map((doc) => doc.data());

            const conflict = appointments.some((appointment) => {
              return (
                appointment.Realtor === realtorId &&
                appointment.Date === date &&
                appointment.Time === time
              );
            });

            resolve(conflict);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    checkConflictAndOpenModal() {
      this.checkConflict(
        this.selectedRealtorId,
        this.selectedDate,
        this.selectedTime
      )
        .then((hasConflict) => {
          if (hasConflict) {
            this.$emit(
              "snackbar",
              "Já existe um agendamento para esse horário. Por favor, escolha outro horário."
            );
          } else {
            this.openModal();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    async create(payload) {
      const previous = await getDocs(
        query(
          collection(db, "appointments"),
          where("Property", "==", payload.Property),
          where("Realtor", "==", payload.Realtor),
          where("Date", "==", payload.Date),
          where("Time", "==", payload.Time)
        )
      );
      if (previous.docs.length > 0) {
        const docRef = doc(db, "appointments", previous.docs[0].id);
        await updateDoc(docRef, payload);
        return docRef;
      }
      const docRef = await addDoc(collection(db, "appointments"), payload);
      return docRef;
    },
    getFormatDate(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return `${date.getUTCDate()}/${
        date.getUTCMonth() + 1
      }/${date.getUTCFullYear()}`;
    },
    selectCard(card) {
      this.selectedCard = card;
    },
    async create(payload) {
      const docRef = await addDoc(collection(db, "appointments"), payload);
      return docRef;
    },
    async addAppointment() {
      const auth = getAuth();
      const user = auth.currentUser;
      const displayName = user.displayName;

      const payload = {
        Property: this.selectedCard,
        Realtor: this.selectedRealtorId,
        Date: this.selectedDate,
        Time: this.selectedTime,
        Status: this.bookingStatus,
        Requester: displayName,
      };
      await this.create(payload);
      this.$refs.form.reset();
      this.$router.push({ name: "customerLanding" });
    },
    async getPropertyCard() {
      const querySnapshot = await getDocs(collection(db, "property"));
      this.cards = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
    },
    async getRealtors() {
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "realtor"))
      );
      this.realtors = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
    },
  },
  mounted() {
    this.getPropertyCard();
    this.getRealtors();
  },
};
</script>

<template>
  <Menu class="mb-8 elevation-3"></Menu>

  <v-container class="cardprincipal mb-8 elevation-2 w-75">
    <div class="d-flex flex-row align-center justify-center w-100">
      <div class="w-25"></div>
      <h2 class="text-center w-50">Agende seu horário:</h2>
      <div
        class="btn-container d-flex align-end justify-end mr-2 mt-2 w-25"
        @click="$router.push({ name: 'customerLanding' })"
      >
        <v-btn class="rounded-pill elevation-1" expand-on-hover variant="flat">
          <p class="text text-body-2 text-grey-darken-2">Clique para voltar</p>
          <span
            ><v-icon size="x-large" color="grey-darken-2"
              >mdi-arrow-left</v-icon
            ></span
          >
        </v-btn>
      </div>
    </div>

    <p class="ml-10"><strong>Escolha o local:</strong></p>

    <div class="d-flex align-center mt-4">
      <LocationCard
        v-for="card in cards"
        :key="card.id"
        :title="card.landName"
        :description="card.landDescription"
        :image="card.landImage"
        :land="card.landSize"
        :delivery="card.landDelivery"
        :type="card.landType"
        :isSelected="selectedCard === card"
        @select="selectCard(card)"
      />
    </div>

    <div class="d-flex align-center justify-center my-5">
      <div>
        <p class="ml-16 mb-5"><strong>Escolha o Dia e Horário:</strong></p>
        <div class="caixa-dia d-flex align-center justify-center mx-7">
          <v-date-picker
            class="ml-7 w-50 rounded-0"
            v-model.string="selectedDate"
            :disabled-dates="disabledDates"
            :mode="'date'"
          ></v-date-picker>

          <div class="w-50">
            <v-chip-group
              class="d-flex justify-center w-100"
              v-model="selectedTime"
              selected-class="text-blue-darken-4"
              mandatory
            >
              <v-chip
                v-for="time in schedules"
                :key="time"
                :value="time"
                size="x-large"
                class="mx-4 my-5 rounded-0"
              >
                {{ time }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </div>

      <v-form
        class="w-50 ml-5 mr-8"
        @submit.prevent="addAppointment"
        ref="form"
        v-model="isFormValid"
      >
        <v-card class="w-100 pl-5 py-4 bg-blue-darken-4 d-flex flex-column">
          <h3 class="text-center mb-1">Detalhes do serviço:</h3>
          <v-divider class="my-2"></v-divider>
          <p><strong>Lote: </strong> {{ selectedCard?.landName }}</p>
          <p><strong>Corretor(a): </strong> {{ selectedRealtor?.name }}</p>
          <p><strong>Dia: </strong> {{ getFormatDate(selectedDate) }}</p>
          <p><strong>Horário: </strong> {{ selectedTime }}</p>
          <span><strong>Duração da visita: </strong>1 hora</span>
          <v-divider class="my-2"></v-divider>
          <p class="text-center"><strong>Escolha seu corretor(a):</strong></p>
          <v-select
            :items="realtors"
            item-title="name"
            item-value="id"
            v-model="selectedRealtorId"
            placeholder="Escolha o corretor"
            class="mt-3 px-16"
            variant="underlined"
            required
          ></v-select>

          <div class="d-flex flex-column align-center justify-center">
            <v-btn
              :width="270"
              @click="
                checkConflictAndOpenModal(
                  selectedRealtor,
                  selectedDate,
                  selectedTime
                )
              "
              >Reservar Horário</v-btn
            >
          </div>
        </v-card>
      </v-form>
      <ConfirmationModal
        modal-title="As informações abaixo estão corretas?"
        :name="selectedCard?.landName"
        :person="selectedRealtor?.name"
        :date="getFormatDate(selectedDate)"
        :time="selectedTime"
        :open="showModal"
        @closeModal="showModal = false"
        @submit="addAppointment"
      />
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
.card-time {
  width: 550px;
}
.caixa-dia {
  background-color: white;
  height: 320px;
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
.btn-container:hover .text {
  display: flex;
  width: 130px;
  align-content: center;
}

h2 {
  font-size: 2rem;
}
</style>

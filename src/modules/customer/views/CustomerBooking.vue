<script>
import {
  addDoc,
  getDocs,
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LocationCard from "@/modules/customer/components/LocationCards.vue";
import ConfirmationModal from "@/modules/customer/components/ConfirmationModal.vue";

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
            weekdays: [1, 7],
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
        alert("Por favor, selecione todas as opções");
      }
    },
    async checkConflict(realtor, date, time) {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointments = querySnapshot.docs.map((doc) => doc.data());

      const conflict = appointments.some((appointment) => {
        return (
          appointment.Realtor === realtor &&
          appointment.Date === date &&
          appointment.Time === time
        );
      });

      if (conflict) {
        alert(
          "Já existe um agendamento para esse horário com o mesmo corretor. Por favor, escolha outro horário."
        );
      } else {
        return conflict;
      }
    },
    async checkConflictAndOpenModal() {
      const hasConflict = await this.checkConflict(
        this.selectedRealtor,
        this.selectedDate,
        this.selectedTime
      );

      if (hasConflict === false) {
        this.openModal();
      }
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
        Property: this.selectedCard?.landName,
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
  <v-container class="bg-grey w-75">
    <h1 class="text-center">Agende seu horário</h1>

    <h3>Escolha o local:</h3>
    <div class="d-flex align-center mt-4">
      <LocationCard
        v-for="card in cards"
        :key="card.id"
        :title="card.landName"
        :description="card.description"
        :image="card.landImage"
        :land="card.landSize"
        :delivery="card.landDelivery"
        :type="card.landType"
        :is-selected="selectedCard === card"
        @select="selectCard(card)"
      />
    </div>
    <v-divider></v-divider>

    <div class="d-flex align-center justify-center my-5">
      <v-card class="d-flex align-center justify-center bg-blue-lighten-5 mx-7">
        <v-date-picker
          class="ml-7 w-50"
          v-model.string="selectedDate"
          :disabled-dates="disabledDates"
          :mode="'date'"
        ></v-date-picker>

        <v-chip-group
          class="d-flex justify-center"
          v-model="selectedTime"
          selected-class="text-deep-purple-accent-4"
          mandatory
        >
          <v-chip
            v-for="time in schedules"
            :key="time"
            :value="time"
            size="x-large"
            rounded="sm"
            class="mx-4 my-5"
          >
            {{ time }}
          </v-chip>
        </v-chip-group>
      </v-card>
      <v-form
        class="w-50 ml-5 mr-8"
        @submit.prevent="addAppointment"
        ref="form"
        v-model="isFormValid"
      >
        <v-card class="w-100 pl-5 py-4 bg-blue-lighten-5 d-flex flex-column">
          <h3 class="text-center">Detalhes do serviço</h3>
          <br />
          <p>Lote: {{ selectedCard?.landName }}</p>
          <p>Corretor(a): {{ selectedRealtor?.name }}</p>
          <p>Horário: {{ getFormatDate(selectedDate) }} - {{ selectedTime }}</p>
          <span><strong>Duração da visita: </strong>1 hora</span>
          <v-divider class="mb-4"></v-divider>
          <span
            ><strong>Escolha por quem gostaria de ser atendido:</strong></span
          >
          <v-select
            :items="realtors"
            item-title="name"
            item-value="id"
            v-model="selectedRealtorId"
            placeholder="Escolha o corretor"
            label="Membro da equipe"
            class="mt-3 px-16"
            color="blue"
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
              >Agendar</v-btn
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

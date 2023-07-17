<script>
export default {
  props: {
    key: String,
    title: String,
    description: String,
    image: String,
    land: String,
    delivery: String,
    type: String,
    isSelected: Boolean,
  },
  emits: ["select"],
  methods: {
    selectCard() {
      this.$emit("select", this.isSelected);
    },
  },
};
</script>

<template>
  <v-card
    :class="{ selected: isSelected }"
    @click="selectCard"
    class="mx-auto mb-6 card rounded-0">

    <v-img width="400" height="300" :src="image" />

    <v-card-title>{{ title }} </v-card-title>
    
    <v-card-subtitle>Endereço:<br>{{ description }}</v-card-subtitle>

    <div class="my-4 d-flex justify-center align-center">
      <span>
        <v-icon class="ml-4" size="large">mdi-land-plots</v-icon>
        {{ land }}
      </span>
      <span>
        <v-icon class="ml-4" size="x-large">mdi-home-outline</v-icon>
        {{ type }}
      </span>
    </div>
  </v-card>
</template>

<style scoped>
.card{
 width: 400px;
}

</style>
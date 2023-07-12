<script>
export default{
    props: {
        title: String,
        details: String,
        description: String,
        image: String,
        land:String,
        delivery: String,
        type: String,
    },
}
</script>

<template>
  <v-card max-width="380" class="mx-auto mb-6">
    <v-img width="400" height="250" :src=image />
    <v-card-title
      ><span>{{ title }}</span>
      </v-card-title
    >
    <v-card-text>
      <div>{{ description }}</div>
    </v-card-text>
    <div class="my-4">
      <span>
        <v-icon class="ml-4" size="large">mdi-land-plots</v-icon>
{{ land }}
      </span>
      <span>
        <v-icon class="ml-4" size="x-large">mdi-home-outline</v-icon>
{{ type }}
      </span>
      <span>
        <v-icon class="ml-4" size="x-large">mdi-alarm</v-icon>
{{ delivery }}
      </span>
    </div>
  </v-card>
</template>

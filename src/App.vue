<template>
  <v-app id="inspire" dark>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-title>Onering</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-md text-md-center>
          <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
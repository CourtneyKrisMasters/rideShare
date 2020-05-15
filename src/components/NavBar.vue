<template>
  <v-app-bar app dark color="cyan darken-1">
    <v-btn text color="cyan darken-1" v-bind:to="{ name: 'home-page' }">
      <v-toolbar-title class="white--text">
        Ride Share
      </v-toolbar-title>
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn text v-if="!isLoggedIn" v-bind:to="{ name: 'admin' }">
      Admin
    </v-btn>
    <v-btn text v-if="!isLoggedIn" class="mx-2" v-bind:to="{ name: 'driverLogin' }">
      Driver
    </v-btn>
    <v-btn text v-if="!isLoggedIn" v-bind:to="{ name: 'passengerLogin' }">
      Passenger
    </v-btn>

    <v-btn text v-if="isLoggedIn" @click="signOut" v-bind:to="{ name: 'home-page' }">
      Log Out
    </v-btn>

    <!-- <v-menu v-if="isLoggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon dark>mdi-account</v-icon>
          <span>{{ $store.state.currentAccount.firstName }}</span>
          <v-icon dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-bind:to="{ name: 'accounts' }">
          <v-list-item-title>Accounts</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="signOut">
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },

  methods: {
    signOut() {
      this.$store.commit("logOut");
      if (this.$router.currentRoute.name != "home-page") {
        this.$router.push({ name: "home-page" });
      }
    }
  }
};
</script>

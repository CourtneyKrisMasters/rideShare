<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Log in</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="firstName"
                label="First Name"
                name="firstName"
                type="text"
              />
              <v-text-field
                v-model="lastName"
                label="Last Name"
                name="lastName"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-bind:to="{ name: 'passengerSignUp' }" color="white">Don't have an account? Sign up!</v-btn>
            <v-btn v-on:click="logIn" color="primary">Log In</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.msge }}
      <v-btn text color="primary" @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",

      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  methods: {
    logIn() {
      this.$axios
        .post("/passenger", {
          firstName: this.firstName,
          lastName: this.lastName,
        })
        .then((result) => {
          this.showSnackbar(result.data.msge);
          console.log(result.data.msge);
          if (result.data.ok) {
            this.$store.commit("logIn", result.data.details);
            this.$router.push({ name: "passenger" });
          }
        })
        .catch((err) => this.showSnackbar(err));
    },

    showSnackbar(msge) {
      this.snackbar.msge = msge;
      this.snackbar.show = true;
    },
  },
};
</script>

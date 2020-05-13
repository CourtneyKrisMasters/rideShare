<!--pop up form to add a new "Drivers" Driver/Ride Pair-->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign Up to Drive</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col class="d-flex">
                  <v-select
                    v-model="authorizationObject.rideId"
                    :items="rideItems"
                    item-text="name"
                    item-value="id"
                    label="Select Ride"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="handleSubmit" color="primary"
            >Sign Up</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-xs-center">
        <v-dialog v-model="dialogVisible" width="500">
        <v-card>
          <v-card-title primary-title>
            {{ dialogHeader }}
          </v-card-title>

            <v-card-text>
            {{ dialogText }}
          </v-card-text>

            <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </v-container>
</template>

<script>
export default {
  name: "Drivers",
  data: function () {
    return {
        authorizationObject: {
        rideId: "",
        driverId: "",
      },

    rideItems: [],

    // Was an account created successfully?
    newauthorizationObjectCreated: false,

    // Data to be displayed by the dialog.
    dialogHeader: "<no dialogHeader>",
    dialogText: "<no dialogText>",
    dialogVisible: false,

    };
  },

//gets all rides for the dropdown
mounted: function() {
    this.$axios.get("/rides", { //look on line 152
          params: {
            driverId: this.$store.state.currentAccount.id,
          }
        })  
    .then(response => {
    this.rideItems = response.data.map(item => ({
        id: item.id, 
        date: item.date,
        time: item.time
    }));
    });
},

  methods: {
      // Invoked when the user clicks the 'Sign Up' button.
    handleSubmit: function () {
      // Haven't been successful yet.
      this.newauthorizationObjectCreated = false;
      this.$axios 
        .post("/drivers", { //  Look on line 290 in db.js to find this code
          rideId: this.authorizationObject.rideId,
          driverId: this.$store.state.currentAccount.id,
        })
        .then((result) => {
          // Based on whether things worked or not, show the
          // appropriate dialog.
          this.showDialog("Success", "result.data.msge");
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
            this.newauthorizationObjectCreated = true;
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
        })
        .catch((err) => this.showDialog("Failed", err));
    },
    // Helper method to display the dialog box with the appropriate content.
    showDialog: function (header, text) {
      this.dialogHeader = header;
      console.log(text);
      this.dialogText = text;
      this.dialogVisible = true;
    },

    // Invoked by the "Okay" button on the dialog; dismiss the dialog
    // and navigate to the home page.
    hideDialog: function () {
      this.dialogVisible = false;
      if (this.newauthorizationObjectCreated) {
        // Only navigate away from the sign-up page if we were successful.
        this.$router.push({ name: "admin" });
      }
    },
  },
};
</script>
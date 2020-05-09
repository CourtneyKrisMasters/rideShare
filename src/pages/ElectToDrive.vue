<template>
  <v-container>
    <div>
      <h4 class="display-1">Sign Up to Drive</h4>

      <p class="body-1">Chose which ride you want to drive.</p>

        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Authorized Rides</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                    <v-row >
                        <v-col class="d-flex">
                        <v-select
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
                    <v-btn v-on:click="handleSubmit" color="primary">Sign Up</v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
            </v-row>
        </div>
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
  data: function() {
    return {
        rideItems: [],

        // Was an account created successfully?
        newauthorizationObjectCreated: false,

        // Data to be displayed by the dialog.
        dialogHeader: "<no dialogHeader>",
        dialogText: "<no dialogText>",
        dialogVisible: false,
    };
  },

  //gets all drivers for the dropdown
  mounted: function() {
       this.$axios.get("/rides")
       .where(this.)
       .then(response => {
        this.rideItems = response.data.map(item => ({
            date: item.date,
            time: item.time,
            distance: item.distance,
            fuelprice: item.fuelPrice,
            fee: item.fee,
            vehicleid: item.vehicleId,
            fromlocation: item.fromLoaction,
            tolocation: item.toLocation,
            passengers: item.passengers,
            drivers: item.drivers,
        }));
      });
  },

  methods: {
      // Invoked when the user clicks the 'Sign Up' button.
    handleSubmit: function () {
      // Haven't been successful yet.
      this.newauthorizationObjectCreated = false;

      this.$axios //this probably needs to be fixed 
        .post("/authorization", {
          //TODO - send the id to the db
          driverId: this.driver.id,
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
    }
  },
};
</script>
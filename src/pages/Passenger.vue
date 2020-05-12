<template>
  <v-container>
    <div>
      <h4 class="display-1">Welcome!</h4>
      <p class="body-1">Hey, there's some pretty cool stuff you can do here.</p>

      <v-spacer></v-spacer>
      <h4 class="display-1">Current Rides</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="currentRides"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>{{ item.date }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.fromLocation }}</td>
            <td>{{ item.toLocation }}</td>
            <td>{{ item.fuelPrice }}</td>
            <td>{{ item.fee }}</td>
            <td>{{ item.licenseNumber }}</td>
            <td>{{ item.vehicleType }}</td>
            <td>{{ item.make }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.color }}</td>
            <td>
              <v-icon small @click="showDialog(item.id)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog.visible" max-width="400">
        <v-card>
          <v-card-title class="headline">Cancel a Ride</v-card-title>
          <v-card-text>
            Are you sure you want to cancel this ride? ID={{ dialog.rideId }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="cancelRide(dialog.rideId)">
              Yes
            </v-btn>
            <v-btn color="primary" @click="hideDialog()">
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.visible">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.visible = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Passenger",

  data: function () {
    return {
      headers: [
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "From Location", value: "fromLocation" },
        { text: "To Location", value: "toLocation" },
        { text: "Fuel Price", value: "fuelPrice" },
        { text: "Fee", value: "fee" },
        { text: "Vehicle's License Plate Number", value: "licenseNumber" },
        { text: "Vehicle Type", value: "type" },
        { text: "Vehicle Make", value: "make" },
        { text: "Vehicle Model", value: "model" },
        { text: "Vehicle Color", value: "color" },
      ],
      currentRides: [],
      //singlePassengerFuelPrice: 0,

      snackbar: {
        visible: false,
        text: "",
      },

      dialog: {
        visible: false,
        rideId: NaN,
      },
    };
  },

  mounted: function () {
    //prints out ride information
    this.$axios
      .get(`/passengers/${this.$store.state.currentAccount.id}/rides`)
      .then((response) => {
        this.currentRides = response.data.rides.map((currentRide) => ({
          id: currentRide.id,
          date: new Date(currentRide.date).toDateString(),
          time: currentRide.time,
          fromLocation: `${currentRide.fromlocation.city}, ${currentRide.fromlocation.state}`,
          toLocation: `${currentRide.tolocation.city}, ${currentRide.tolocation.state}`,
          //could do math here to divide the fuel price by the number of passengers and add to the total fee
          fuelPrice: `$${currentRide.fuelprice}`,
          fee: `$${currentRide.fee}`,
          licenseNumber: currentRide.vehicles.licensenumber,
          vehicleType: currentRide.vehicles.vehicletypes.type,
          make: currentRide.vehicles.make,
          model: currentRide.vehicles.model,
          color: currentRide.vehicles.color,
        }));
        //console.log(this.$store.state.currentAccount.id)
        //console.log(this.currentRides);
      })
      .catch((err) => this.showSnackbar(err));
  },

  methods: {
    showDialog: function (rideId) {
      this.dialog.rideId = rideId;
      this.dialog.visible = true;
    },

    hideDialog: function () {
      this.dialog.visible = false;
    },

    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    // Calculate the CSS class for an item
    itemClass(item) {
      const currentAccount = this.$store.state.currentAccount;
      if (currentAccount && currentAccount.id === item.id) {
        return "currentAccount";
      }
    },

    // // Update account information.
    // updateAccount(item) {
    //   console.log("UPDATE", JSON.stringify(item, null, 2));
    //   this.showSnackbar("Sorry, update is not yet implemented.");
    // },

    // Delete an account.
    cancelRide(rideId) {
      this.$axios
        .delete(
          `/passengers/${this.$store.state.currentAccount.id}/rides/${rideId}`
        )
        .then((response) => {
          try {
            if (response.data.ok) {
              // The delete operation worked on the server; delete the local account
              // by filtering the deleted account from the list of accounts.
              this.currentRides = this.currentRides.filter(
                (currentRide) => currentRide.id !== rideId
              );
              console.log("YAY it worked");
            }
            console.log(response);
          } catch (e) {
            console.log(e.message);
          }
          this.hideDialog();
        });
    },
  },
};
</script>

<style>
.currentAccount {
  background: lightcoral;
}
</style>

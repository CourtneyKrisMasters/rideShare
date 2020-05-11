<template>
  <v-container>
    <div>
      <h4 class="display-1">Welcome, Admin!</h4>
      <p class="body-1">Do some cool admin stuff here.</p>
      <br>
      <h4 class="display-1">Ride Information</h4>
      <br>
      <v-btn color = "primary" v-bind:to="{ name: 'rides' }">
        Report of Current Rides
      </v-btn>
       <v-btn color = "primary" v-bind:to="{ name: 'addRides' }">
        Add a New Ride
      </v-btn>
      <v-btn color = "primary" v-bind:to="{ name: 'updateRide' }">
        Update a Ride
      </v-btn>
      <br>
      <br>

      <h4 class="display-1" display: inline>Vehicle Information</h4>
      <br>

      <v-btn color = "primary" v-bind:to="{ name: 'vehicleTypes' }">
        Add a Vehicle Type
      </v-btn>

      <v-btn  color = "primary" v-bind:to="{ name: 'vehicles' }">
        Add  A Vehicle
      </v-btn>

      <v-btn  color = "primary" v-bind:to="{ name: 'updateVehicle' }">
        Update A Vehicle
      </v-btn>
      <br>
      <br>
  
       <h4 class="display-1" display: inline>Driver Authorization</h4>
       <br>

      <v-btn  color = "primary" v-bind:to="{ name: 'authorization' }">
        Authorize a Driver
      </v-btn>
      <v-spacer></v-spacer>

      <v-snackbar v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.show = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Rides",

  data: function() {
    return {
      headers: [
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "Distance", value: "distance" },
        { text: "Fuel Price", value: "fuelprice" },
        { text: "Fee", value: "fee" },
        { text: "Vehicle ID", value: "vehicleid" },
        { text: "From Location", value: "fromlocation" },
        { text: "To Location", value: "tolocation" },
        { text: "Passengers", value: "passengers" },
        { text: "Drivers", value: "drivers" },
      ],
      rides: [],

      snackbar: {
        show: false,
        text: "",
      },
    };
  },

  mounted: function() {
    //prints out ride information
    this.$axios.get("/admin").then((response) => {
      this.rides = response.data.map((ride) => ({
        date: new Date(ride.date).toDateString(),
        time: ride.time,
        distance: `${ride.distance} mi`,
        fuelprice: `$ ${ride.fuelprice}`,
        fee: `$ ${ride.fee}`,
        vehicleid: ride.vehicles.licensenumber,
        fromlocation: `${ride.fromlocation.city}, ${ride.fromlocation.state}`,
        tolocation: `${ride.tolocation.city}, ${ride.tolocation.state}`,
        passengers: ride.passengers.map(p => `${p.firstname} ${p.lastname}`),
        drivers: ride.drivers.map(d => `${d.firstname} ${d.lastname}`),
      }));
      console.log(this.rides);
    });
  },

  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    // Calculate the CSS class for an item
    itemClass(item) {
      const currentAccount = this.$store.state.currentAccount;
      if (currentAccount && currentAccount.id === item.id) {
        return "currentAccount";
      }
    },

    // Update account information.
    updateAccount(item) {
      console.log("UPDATE", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, update is not yet implemented.");
    },

    // Delete an account.
    deleteAccount(item) {
      this.$axios.delete(`/accounts/${item.id}`).then((response) => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local account
          // by filtering the deleted account from the list of accounts.
          this.accounts = this.accounts.filter(
            (account) => account.id !== item.id
          );
        }
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

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
              <v-icon small @click="cancelRide(item)">
                mdi-delete
              </v-icon>
            <!--<v-icon small class="ml-2" @click="updateAccount(item)">
                mdi-pencil
              </v-icon>-->
            </td>
          </tr>
        </template>
      </v-data-table>

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
      //rideId: 0,
      //singlePassengerFuelPrice: 0,

      snackbar: {
        show: false,
        text: "",
      },
    };
  },

 mounted: function() {
    //prints out ride information
    this.$axios.get(`/passengers/${this.$store.state.currentAccount.id}/rides`).then((response) => {
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
      //this.rideId = response.data.rides.id
      //console.log(response.data.rides.map.id)
      
    })
    .catch((err) => this.showDialog("Failed", err));
  },

  
  methods: {
    showDialog: function (header, text) {
      this.dialogHeader = header;
      console.log(text)
      console.log(this.$store.state.currentAccount.id)
      this.dialogText = text;
      this.dialogVisible = true;
    },
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

    // // Update account information.
    // updateAccount(item) {
    //   console.log("UPDATE", JSON.stringify(item, null, 2));
    //   this.showSnackbar("Sorry, update is not yet implemented.");
    // },

    // Delete an account.
    cancelRide(item) {
      this.$axios.delete(`/passengers/${this.$store.state.currentAccount.id}/rides/${item.id}`).then((response) => {
        try{
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local account
          // by filtering the deleted account from the list of accounts.
          this.currentRides = this.currentRides.filter(
            (currentRide) => currentRide.id !== item.id
          );
          console.log("YAY it worked");
        }
        console.log(response);
        } catch (e){
          console.log(e.message);
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

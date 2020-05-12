<template>
  <v-container>
    <div>
      <h4 class="display-1">Welcome, Driver!</h4>
      <p class="body-1">Hey, there's some pretty cool driving stuff you can do here.</p>

          <v-btn text v-bind:to="{ name: 'electToDrive' }">
            Sign Up to Drive
          </v-btn>

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
            <!--
            does our driver really need to see these numbers?
            <td>{{ item.fuelPrice }}</td>
            <td>{{ item.fee }}</td>
            -->
            <td>{{ item.licenseNumber }}</td>
            <td>{{ item.vehicleType }}</td>
            <td>{{ item.make }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.color }}</td>
             <td>
              <v-icon small @click.stop="dialog = true"> 
                mdi-delete
              </v-icon>
               <v-dialog
                v-model="dialog"
                max-width="400"
              >
                <v-card>
                  <v-card-title class="headline">Cancel a Ride</v-card-title>
                  <v-card-text>
                    Are you sure you want to cancel this ride?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      @click="cancelDrive(item), dialog = false "
                    >
                      Yes
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="dialog = false"
                    >
                      No
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
        // { text: "Fuel Price", value: "fuelPrice" },
        // { text: "Fee", value: "fee" },
        { text: "Vehicle's License Plate Number", value: "licenseNumber" },
        { text: "Vehicle Type", value: "type" },
        { text: "Vehicle Make", value: "make" },
        { text: "Vehicle Model", value: "model" },
        { text: "Vehicle Color", value: "color" },
      ],
      currentRides: [],

      snackbar: {
        show: false,
        text: "",
      },
      dialog: false
    };
  },

 mounted: function() {
    //prints out ride information
    this.$axios.get(`/drivers/${this.$store.state.currentAccount.id}/drives`).then((response) => {
      this.currentRides = response.data.rides.map((currentRide) => ({
        id: currentRide.id,
        date: new Date(currentRide.date).toDateString(),
        time: currentRide.time,
        fromLocation: `${currentRide.fromlocation.city}, ${currentRide.fromlocation.state}`,
        toLocation: `${currentRide.tolocation.city}, ${currentRide.tolocation.state}`,
        //fuelPrice: `$${currentRide.fuelprice}`,
        //fee: `$${currentRide.fee}`,
        licenseNumber: currentRide.vehicles.licensenumber,
        vehicleType: currentRide.vehicles.vehicletypes.type,
        make: currentRide.vehicles.make,
        model: currentRide.vehicles.model,
        color: currentRide.vehicles.color,
      }));
      console.log(this.$store.state.currentAccount.id)
      console.log(this.currentRides);
      
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

    cancelDrive(item) {
      this.$axios.delete(`/drivers/${this.$store.state.currentAccount.id}/rides/${item.id}`).then((response) => {
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

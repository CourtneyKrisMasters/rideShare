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

    </div>
  </v-container>
</template>


<style>
.currentAccount {
  background: lightcoral;
}
</style>

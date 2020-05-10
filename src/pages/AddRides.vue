<template>
  <v-container>
    <div>
      <h4 class="display-1">Make a New Ride!</h4>
        <p class="body-1">All fields are required.</p>
        <h4 class="display-1">New Ride Information</h4> <!-- make, model, color, vehicleTypeId(int), capacity(int), mpg(float), license state, liscence number -->
          <v-form v-model="valid">
                <v-text-field
                v-model="rideInfo.date" 
                type="date"
                label="Date"
                required
                ></v-text-field>
                <v-text-field
                v-model="rideInfo.time"
                type="time"
                label="Time"
                hint="Example input: 05:30 PM"
                required
                ></v-text-field>
                <v-text-field
                v-model="rideInfo.distance"
                v-bind:rules="rules.floats"
                type="distance"
                label="Distance"
                hint="Distance in miles"
                required
                ></v-text-field>
                 <v-text-field
                v-model="rideInfo.fuelPrice"
                v-bind:rules="rules.floats"
                type="fuelPrice"
                label="Fuel Price"
                required
                ></v-text-field>
                 <v-text-field
                v-model="rideInfo.fee"
                v-bind:rules="rules.floats"
                type="fee"
                label="Fee"
                required
                ></v-text-field>
                <!--instead of having the user type an ID in this field, can we make it a 
                    dropdown with all of the possible vehicles that we have in the Vehicle table-->
                <v-row >
                  <v-col class="d-flex">
                    <v-select
                      v-model="rideInfo.vehicleId"
                      :items="items"
                      item-text="licensenumber"
                      item-value="id"
                      label="Vehicle's License Plate Number"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
            <h4 class="display-1">Departure Information</h4>
                <v-text-field
                v-model="departureInfo.name"  
                v-bind:rules="rules.required"
                type="name"
                label="Location of Departure"
                hint="Example: Bob's House"
                required
                ></v-text-field>
                <v-text-field
                v-model="departureInfo.address"
                v-bind:rules="rules.required"
                type="address"
                label="Address"
                required
                ></v-text-field>
                <v-text-field
                v-model="departureInfo.city"
                v-bind:rules="rules.city"
                type="city"
                label="City"
                required
                ></v-text-field>
                <!--dropdown of states-->
                <v-row >
                  <v-col class="d-flex">
                    <v-select
                      v-model="departureInfo.state"
                      :items="abbreviations"
                      item-text="name"
                      item-value="abbreviation"
                      label="State"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-text-field
                v-model="departureInfo.zipcode"
                v-bind:rules="rules.zipcode"
                type="zipcode"
                label="Zipcode"
                hint="Examples: 12345, 12345-6789, 12345 6789"
                required
                ></v-text-field>
            <h4 class="display-1">Arrival Information</h4>
                <v-text-field
                v-model="arrivalInfo.name"  
                v-bind:rules="rules.required"
                type="name"
                label="Location of Arrival"
                hint="Example: Bob's House"
                required
                ></v-text-field>
                <v-text-field
                v-model="arrivalInfo.address"
                v-bind:rules="rules.required"
                type="address"
                label="Address"
                required
                ></v-text-field>
                <v-text-field
                v-model="arrivalInfo.city"
                v-bind:rules="rules.city"
                type="city"
                label="City"
                required
                ></v-text-field>
                <!--dropdown of states-->
                <v-row >
                  <v-col class="d-flex">
                    <v-select
                      v-model="arrivalInfo.state"
                      :items="abbreviations"
                      item-text="name"
                      item-value="abbreviation"
                      label="State"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-text-field
                v-model="arrivalInfo.zipcode"
                v-bind:rules="rules.zipcode"
                type="zipcode"
                label="Zipcode"
                required
                ></v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="addRide"
              >Add Ride
            </v-btn>
          </v-form>
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
    </div>
  </v-container>
</template>


<script>
// import Instructions from "../components/Instructions.vue";

export default {
  name: "AddRidePage",
  // components: {
  //   Instructions, // Use the Instructions component we just imported
  // },
  data: function () {
    return {
      valid: false, // Are all the fields in the form valid?

      // Object to collect account data
      rideInfo: {
        date: "",
        time: "",
        distance: "",
        fuelPrice: "",
        fee: "",
        vehicleId: "",
      },

      departureInfo: {
          name: "",
          address: "",
          city: "",
          state: "",
          zipcode: "",
      },

      arrivalInfo: {
          name: "",
          address: "",
          city: "",
          state: "",
          zipcode: "",
      },

      items: [],
      abbreviations: [],
      
      fromLocationId: "",
      toLocationId: "",

      // Was the account reset successfully?
      rideAdd: false,

      // Data to be displayed by the dialog.
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      // Validation rules for the form fields. This functionality is an extension
      // that's part of the Vuetify package. Each rule is a list of functions
      // (note the fat arrows). Vuetify invokes all functions in the list,
      // passing it the content of the associated form field. Functions should
      // return either true (the field passes that validation) or a string
      // containing an error message indicating why the field doesn't pass validation.
      rules: {
        required: [
            (val) => val.length > 0 || "Required"
        ],
        numbers: [
            (val) => /^[0-9]*$/.test(val) || "Requires digits",
        ],
        floats: [
            (val) => /[+-]?([0-9]*[.])?[0-9]+/.test(val) || "Requires a decimal number",
        ],
        city: [
            (val) => /^[a-zA-Z\- ]+$/.test(val) || "Requires a valid city name"
        ],
        zipcode: [
            (val) => /^\d{5}(?:[-\s]\d{4})?$/.test(val) || "Requires a vaild zipcode"
        ],

      }

    };
  },

  //gets all vehicle types and states for the dropdowns on load
  mounted: function() {
       this.$axios.get("/vehicles").then(response => {
        this.items = response.data.map(item => ({
          id: item.id,
          licensenumber: item.licensenumber,
        }));
      }),
      this.$axios.get("/states").then(response => {
        this.abbreviations = response.data.map(item => ({
          abbreviation: item.abbreviation,
          name: item.name,
           }));
      })
  },

  methods: {
    // Invoked when the user clicks the 'Add rides' button.
    addRide: function () {
      try{
      // Haven't been successful yet.
      this.rideAdd = false;

      // post from location.
      this.$axios
        .post("/locations", {
          name: this.departureInfo.name,
          address: this.departureInfo.address,
          city: this.departureInfo.city,
          state: this.departureInfo.state,
          zipcode: this.departureInfo.zipcode,
        })
        .then((result) => {
          // Based on whether things worked or not, show the
          // appropriate dialog.
          if (result.data.ok) {
            this.fromLocationId = result.data.newLocation.id;
            console.log(this.fromLocationId)

          }
          //post to location
              this.$axios
                .post("/locations", {
                name: this.arrivalInfo.name,
                address: this.arrivalInfo.address,
                city: this.arrivalInfo.city,
                state: this.arrivalInfo.state,
                zipcode: this.arrivalInfo.zipcode,
              })
              .then((result) => {
                // Based on whether things worked or not, show the
                // appropriate dialog.
                if (result.data.ok) {
                  this.toLocationId = result.data.newLocation.id
                  console.log(this.toLocationId);
                }
                  this.$axios
                    .post("/rides", {
                      date: this.rideInfo.date,
                      time: this.rideInfo.time,
                      distance: this.rideInfo.distance,
                      fuelPrice: this.rideInfo.fuelPrice,
                      fee: this.rideInfo.fee,
                      vehicleId: this.rideInfo.vehicleId,
                      fromLocation: this.fromLocationId,
                      toLocation: this.toLocationId,
                    })
                    .then((result) => {
                      // Based on whether things worked or not, show the
                      // appropriate dialog.
                      if (result.data.ok) {
                        this.showDialog("Success", result.data.msge);
                        this.rideAdd = true;
                      } else {
                        this.showDialog("Sorry", result.data.msge);
                      }
                    })
                  })
            })
   
        .catch((err) => this.showDialog("Failed", err));
        } catch (e) {
          console.log(e.message)
          
        }
    },
    // Helper method to display the dialog box with the appropriate content.
    showDialog: function (header, text) {
      this.dialogHeader = header;
      console.log(this.rideInfo.vehicleId)
      console.log(text)
      this.dialogText = text;
      this.dialogVisible = true;
    },

    // Invoked by the "Okay" button on the dialog; dismiss the dialog
    // and navigate to the home page.
    hideDialog: function () {
      this.dialogVisible = false;
      if (this.rideAdd) {
        // Only navigate away from the reset page if we were successful.
        this.$router.push({ name: "admin" });
      }
    },
  },
};
</script>


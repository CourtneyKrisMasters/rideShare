<template>
  <v-container>
    <div>
      <h4 class="display-1">Update a ride</h4>
      <p class="body-1">
        Fill in your ride's documented license number, date, and time to show
        current it's information.
      </p>
      <v-form v-model="valid">
        <!--verify vehicleId, date, and time -->
        <v-text-field
          v-model="confirmedLicenseNumber"
          v-bind:rules="rules.required"
          label="Vehicle License"
          required
        ></v-text-field>

        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="confirmedDate"
              label="Date"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker 
            v-model="confirmedDate" 
            @input="menu1 = false" 
            color ="cyan darken-1"
          ></v-date-picker>
        </v-menu>

        <v-menu
          ref="menu"
          v-model="menu2"
          :close-on-content-click="false"
          :return-value.sync="confirmedTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="confirmedTime"
              label="Time"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu2"
            v-model="confirmedTime"
            full-width
            @click:minute="$refs.menu.save(confirmedTime)"
            color ="cyan darken-1"
          ></v-time-picker>
        </v-menu>

        <v-alert v-if="showPrompt" type="info">
          Please fill out the vehicle's license number, registered date, and
          registered time.
        </v-alert>

        <v-alert v-if="showInvalid" type="warning">
          Not all of your fields are valid.
        </v-alert>

        <v-alert v-if="showValid" type="success">
          Great! Update the ride's information.
        </v-alert>
        <h4 class="display-1">Trip Information</h4>

        <v-menu
          v-model="menu3"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="rideInfo.date"
              label="Date"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker 
            v-model="rideInfo.date" 
            @input="menu3 = false" 
            color ="cyan darken-1"
          ></v-date-picker>
        </v-menu>

        <v-menu
          ref="menu_4"
          v-model="menu4"
          :close-on-content-click="false"
          :return-value.sync="rideInfo.time"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="rideInfo.time"
              label="Time"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu4"
            v-model="rideInfo.time"
            full-width
            @click:minute="$refs.menu_4.save(rideInfo.time)"
            color ="cyan darken-1"
          ></v-time-picker>
        </v-menu>


        <!--
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
        -->
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
        <v-row>
          <v-col class="d-flex">
            <v-select
              v-model="rideInfo.vehicleId"
              :items="items"
              item-text="licensenumber"
              item-value="id"
              label="Change Vehicle's License Plate Number"
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
        <v-row>
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
        <v-row>
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
        <v-btn v-bind:disabled="!valid" v-on:click="updateRide"
          >Update Ride
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
import debounce from "lodash/debounce";

export default {
  name: "UpdateRide",
  // components: {
  //   Instructions, // Use the Instructions component we just imported
  // },
  data: function () {
    return {
      valid: false, // Are all the fields in the form valid?

      // Object to collect account data
      rideInfo: {
        id: 0,
        date: "",
        time: "",
        distance: "",
        fuelPrice: "",
        fee: "",
        vehicleId: "",
      },

      departureInfo: {
        id: 0,
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
      },

      arrivalInfo: {
        id: 0,
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
      },

      // Break this out from `vehicleInfo`.
      confirmedLicenseNumber: "",
      confirmedDate: new Date().toISOString().substr(0, 10),
      confirmedTime: null,
      queryResponseReceived: false,
      rideInfoValid: false,
      debouncedValidation: null,

      items: [],
      abbreviations: [],

      // Was the account reset successfully?
      rideAdd: false,

      // Data to be displayed by the dialog.
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      landscape: true,
      showCurrent: true,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,

      // Validation rules for the form fields. This functionality is an extension
      // that's part of the Vuetify package. Each rule is a list of functions
      // (note the fat arrows). Vuetify invokes all functions in the list,
      // passing it the content of the associated form field. Functions should
      // return either true (the field passes that validation) or a string
      // containing an error message indicating why the field doesn't pass validation.
      rules: {
        required: [(val) => val.length > 0 || "Required"],
        numbers: [(val) => /^[0-9]*$/.test(val) || "Requires digits"],
        floats: [
          (val) =>
            /[+-]?([0-9]*[.])?[0-9]+/.test(val) || "Requires a decimal number",
        ],
        city: [
          (val) => /^[a-zA-Z\- ]+$/.test(val) || "Requires a valid city name",
        ],
        zipcode: [
          (val) =>
            /^\d{5}(?:[-\s]\d{4})?$/.test(val) || "Requires a vaild zipcode",
        ],
      },
    };
  },

  //gets all vehicle types and states for the dropdowns on load
  mounted: function () {
    // Create the debounce function for the query-by-license field.
    this.debouncedValidation = debounce(this.checkAllValidation, 3000);

    // Get all vehicle types for the dropdown.
    this.$axios.get("/vehicles").then((response) => {
        this.items = response.data.map((item) => ({
          id: item.id,
          licensenumber: item.licensenumber,
        }));
      }),
      this.$axios.get("/states").then((response) => {
        this.abbreviations = response.data.map((item) => ({
          abbreviation: item.abbreviation,
          name: item.name,
        }));
      });
  },

  watch: {
    //program is not catching these as functions
    //if(confirmedLicenseNumber && confirmedDate && confirmedTime){function ()}
    //['confirmedLicenseNumber', 'confirmedDate', 'confirmedTime'], function (){this.debouncedValidation();},
    confirmedLicenseNumber: function () {
      //add some console.log statements
      this.debouncedValidation();
    },
    confirmedDate: function () {
      this.debouncedValidation();
    },
    confirmedTime: function () {
      this.debouncedValidation();
    },
  },

  computed: {
    showPrompt() {
      return (
        this.confirmedLicenseNumber === "" ||
        this.confirmedDate === "" ||
        this.confirmedTime === "" ||
        !this.queryResponseReceived
      );
    },

    showInvalid() {
      return (
        this.confirmedLicenseNumber !== "" &&
        this.confirmedDate !== "" &&
        this.confirmedTime !== "" &&
        this.queryResponseReceived &&
        !this.rideInfoValid
      );
    },

    showValid() {
      return this.rideInfoValid;
    },
  },

  methods: {
    checkAllValidation() {
      //add some console.log statements
      if (
        this.confirmedLicenseNumber &&
        this.confirmedDate &&
        this.confirmedTime
      ) {
        this.fetchMatchingRide();
      }
    },

    fetchMatchingRide: function () {
      this.$axios
        //console.log("CHECK FOR SLASHES... confirmedDate is:" + this.confirmedDate)
        .get("/rides", {
          params: {
            licenseNumber: this.confirmedLicenseNumber,
            date: this.confirmedDate,
            time: this.confirmedTime,
          },
        })

        .then((response) => {
          this.queryResponseReceived = true;
          console.log("Got response", response);

          if (response.data.ok) {
            const detailCount = response.data.details.length;

            // We expect to have received exactly one details object.
            if (detailCount === 0) {
              this.showDialog("Sorry", "No matching ride");
              return;
            }
            if (detailCount > 1) {
              this.showDialog(
                "Sorry",
                `Found ${details.length} responses; expect just one`
              );
              return;
            }

            // Refer to the One True Ride details object.
            const details = response.data.details[0];

            console.log("Response details", details);
            // This could be simplified if the database columns and the properties
            // of vehicleInfo were named identically.
            this.rideInfo = {
              id: details.id,
              date: new Date(details.date).toDateString(),
              time: details.time,
              distance: details.distance,
              fuelPrice: details.fuelprice,
              fee: details.fee,
              vehicleId: details.vehicle.licensenumber,
            };

            // Because the properties in the `details` object match the ones
            // in the departure and arrival info, we can just use the JavaScript
            // spread syntax. 
            // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
            this.departureInfo = { ...details.fromlocation };
            this.arrivalInfo = { ...details.tolocation };

            this.rideInfoValid = true;
          } else {
            // Clear the form in the case the user changes the license number
            // to an invalid one.
            console.log("response data DID NOT work");
            this.rideInfo = {
              date: "",
              time: "",
              distance: "",
              fuelPrice: "",
              fee: "",
              vehicleId: "",
            };
            this.departureInfo = {
              name: "",
              address: "",
              city: "",
              state: "",
              zipcode: "",
            };
            this.arrivalInfo = {
              name: "",
              address: "",
              city: "",
              state: "",
              zipcode: "",
            };
            this.rideInfoValid = false;
          }
        });
    },

    // Invoked when the user clicks the 'Update Ride' button.
    updateRide: function () {
      // Haven't been successful yet.
      this.rideAdd = false;

      // Patch from location to the Hapi server.
      this.$axios
        .patch("/locations", { 
          //line 634 db.js
          id: this.departureInfo.id,
          name: this.departureInfo.name,
          address: this.departureInfo.address,
          city: this.departureInfo.city,
          state: this.departureInfo.state,
          zipcode: this.departureInfo.zipcode,
        })
        .then((response) => {
          if (!response.data.ok) {
            console.log("DEPARTURE PATCH FAILED", response.data);
            this.showDialog("Failure", response.data.msge);
            return;
          }

          //patch to location
          this.$axios
            .patch("/locations",{
              id: this.arrivalInfo.id,
              name: this.arrivalInfo.name,
              address: this.arrivalInfo.address,
              city: this.arrivalInfo.city,
              state: this.arrivalInfo.state,
              zipcode: this.arrivalInfo.zipcode,
            })
            .then((response) => {
              if (!response.data.ok) {
                console.log("ARRIVAL PATCH FAILED", response.data);
                this.showDialog("Failure", response.data.msge);
                return;
              }
              this.$axios
                .patch("/rides", {
                  id: this.rideInfo.id,
                  date: this.rideInfo.date,
                  time: this.rideInfo.time,
                  distance: this.rideInfo.distance,
                  fuelPrice: this.rideInfo.fuelPrice,
                  fee: this.rideInfo.fee,
                  vehicleId: this.rideInfo.vehicleId,
                  fromLocation: this.departureInfo.id,
                  toLocation: this.arrivalInfo.id,
                })
                .then((response) => {
                  // Based on whether things worked or not, show the
                  // appropriate dialog.
                  if (response.data.ok) {
                    this.showDialog("Success", response.data.msge);
                    this.rideAdd = true;
                  } else {
                    this.showDialog("Sorry", response.data.msge);
                  }
                });
            });
        })
        .catch((err) => this.showDialog("Error Caught", err));
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
      if (this.rideAdd) {
        // Only navigate away from the reset page if we were successful.
        this.$router.push({ name: "admin" });
      }
    },

    //TODO - get all vehicle types for dropdown
    getVehicleTypes() {
      this.$axios.get(`/vehicleType/`).then((response) => {
        if (response.data.ok) {
          //somehow put items into array and return that array
          console.log("this worked");
        }
      });
    },
  },
};
</script>

<template>
  <v-container>
    <div>
      <h4 class="display-1">Update a Vehicle</h4>

      <v-spacer></v-spacer>

      <p class="body-1">
        First, what is the license number of the vehicle you're updating?
      </p>
      <v-form v-model="valid">
        <v-text-field
          v-model="licenseNumberQuery"
          v-bind:rules="rules.licenseNumber"
          error-count="10"
          type="licenseNumber"
          label="License Number"
          required
        ></v-text-field>

        <v-alert v-if="showPrompt" type="info">
          Please fill out the vehicle's license number.
        </v-alert>

        <v-alert v-if="showInvalid" type="warning">
          That license number is not valid.
        </v-alert>

        <v-alert v-if="showValid" type="success">
          Great! Update the vehicle's information.
        </v-alert>

        <v-text-field
          v-model="vehicleInfo.make"
          v-bind:rules="rules.make"
          error-count="10"
          type="make"
          label="Make"
        ></v-text-field>
        <v-text-field
          v-model="vehicleInfo.model"
          v-bind:rules="rules.model"
          error-count="10"
          type="model"
          label="Model"
          required
        ></v-text-field>
        <v-text-field
          v-model="vehicleInfo.color"
          v-bind:rules="rules.color"
          error-count="10"
          type="color-text"
          label="Color"
          required
        ></v-text-field>
        <!--instead of having the user type an ID in this field, can we make it a 
                    dropdown with all of the possible vehicle types that we have in the VehicleType table?
                    This will change it from being a text-field to some other kind of field-->
        <v-row>
          <v-col class="d-flex">
            <v-select
              :items="items"
              item-text="type"
              item-value="id"
              label="Vehicle Type"
            ></v-select>
          </v-col>
        </v-row>
        <!--...-->
        <v-text-field
          v-model="vehicleInfo.vehicleTypeId"
          v-bind:rules="rules.vehicleTypeId"
          error-count="10"
          type="vehicleTypeId"
          label="Vehicle Type ID"
          required
        ></v-text-field>
        <v-text-field
          v-model="vehicleInfo.capacity"
          v-bind:rules="rules.capacity"
          error-count="10"
          type="capacity"
          label="How many people can it hold?"
        ></v-text-field>
        <v-text-field
          v-model="vehicleInfo.mpg"
          v-bind:rules="rules.mpg"
          error-count="10"
          type="mpg"
          label="MPG"
          required
        ></v-text-field>
        <!--make a drop down here as well with all of the abbreviations from the State table-->
        <v-row align="left">
          <v-col class="d-flex">
            <v-select
              v-model="vehicleInfo.licenseState"
              :items="abbreviations"
              item-text="name"
              item-value="abbreviation"
              label="State"
              required 
            ></v-select>
          </v-col>
        </v-row>
        <v-btn v-bind:disabled="!valid" v-on:click="updateVehicle"
          >Submit
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
  name: "UpdateVehicle",
  // components: {
  //   Instructions, // Use the Instructions component we just imported
  // },
  data: function () {
    return {
      valid: false, // Are all the fields in the form valid?

      // Object to collect account data
      //TODO - fill in form with stand-in info from current data
      vehicleInfo: {
        make: "",
        model: "",
        color: "",
        vehicleTypeId: "",
        capacity: "",
        mpg: "",
        licenseState: "",
        licenseNumber: "",
      },

      // Break this out from `vehicleInfo`.
      licenseNumberQuery: "",
      licenseNumberResponseReceived: false,
      licenseNumberValid: false,
      debouncedGetVehicle: null,

      items: [],
      abbreviations: [],

      //TODO - write function that grabs data from the vehicle table and fills in the form
      getCurrentVehicleInfo() {},

      // Was the account reset successfully?
      vehicleAdd: false,

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
        required: [(val) => val.length > 0 || "Required"],
      },
      vehicleTypeId: [(val) => /^[0-9]*$/.test(val) || "Requires digits"],
      capacity: [(val) => /^[0-9]*$/.test(val) || "Requires digits"],
      mpg: [
        (val) =>
          /[+-]?([0-9]*[.])?[0-9]+/.test(val) || "Requires a decimal number",
      ],
    };
  },

  mounted: function () {
    // Create the debounce function for the query-by-license field.
    this.debouncedGetVehicle = debounce(this.getVehicle, 2000);

    // Get all vehicle types for the dropdown.
    this.$axios.get("/vehicleTypes").then((response) => {
      this.items = response.data.map((item) => ({
        id: item.id,
        type: item.type,
      }));
    });

    this.$axios.get("/states").then(response => {
        this.abbreviations = response.data.map(item => ({
          abbreviation: item.abbreviation,
          name: item.name,
           }));
      })
  },

  watch: {
    licenseNumberQuery: function () {
      this.debouncedGetVehicle();
    },
  },

  computed: {
    showPrompt() {
      return (
        this.licenseNumberQuery === "" || !this.licenseNumberResponseReceived
      );
    },

    showInvalid() {
      return (
        this.licenseNumberQuery !== "" &&
        this.licenseNumberResponseReceived &&
        !this.licenseNumberValid
      );
    },

    showValid() {
      return this.licenseNumberValid;
    },
  },

  methods: {
    getVehicle: function () {
      this.$axios
        .get("/vehicles", {
          params: {
            licenseNumber: this.licenseNumberQuery,
          },
        })
        .then((result) => {
          this.licenseNumberResponseReceived = true;

          if (result.data.ok) {
            const details = result.data.details;
            // This could be simplified if the database columns and the properties
            // of vehicleInfo were named identically.
            this.vehicleInfo = {
              make: details.make,
              model: details.model,
              color: details.color,
              vehicleTypeId: details.vehicletypeid,
              capacity: details.capacity,
              mpg: details.mpg,
              licenseState: details.licensestate,
              licenseNumber: details.licensenumber,
            };
            this.licenseNumberValid = true;
          } else {
            // Clear the form in the case the user changes the license number
            // to an invalid one.
            this.vehicleInfo = {
              make: "",
              model: "",
              color: "",
              vehicleTypeId: "",
              capacity: "",
              mpg: "",
              licenseState: "",
              licenseNumber: "",
            };
            this.licenseNumberValid = false;
          }
        });
    },

    // Invoked when the user clicks the 'Reset Password' button.
    updateVehicle: function () {
      // Haven't been successful yet.
      this.vehicleAdd = false;

      // Patch the content of the form to the Hapi server.
      this.$axios
        .patch("/vehicles", {
          //password: this.newPassword,
          make: this.vehicleInfo.make,
          model: this.vehicleInfo.model,
          color: this.vehicleInfo.color,
          vehicleTypeId: this.vehicleInfo.vehicleTypeId,
          capacity: this.vehicleInfo.capacity,
          mpg: this.vehicleInfo.mpg,
          licenseState: this.vehicleInfo.licenseState,
          licenseNumber: this.vehicleInfo.licenseNumber,
        })
        .then((result) => {
          // Based on whether things worked or not, show the
          // appropriate dialog.
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
            this.vehicleAdd = true;
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
        })
        .catch((err) => this.showDialog("Failed", err));
        
    },

    getAnswer: function () {
      if (this.question.length < 3) {
        this.answer = 'Invalid license'
        return
      }
      this.answer = 'Thinking...'
      var vm = this.$axios.get('/vehicles/{licenseNumber}')
        .then(function (response) {
          vm.answer = 'Confirmed vehicle'
          this.vehicleInfo = response.data.map(vehicleInfo => ({
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          color: vehicleInfo.color,
          vehicleTypeId: vehicleInfo.vehicleTypeId,
          capacity: vehicleInfo.capacity,
          mpg: vehicleInfo.mpg,
          licenseState: vehicleInfo.licenseState,
          }));
        })
        .catch(function (error) {
          vm.answer = 'Error! That is not registered as a liscense number' + error
        })
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
      if (this.vehicleAdd) {
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

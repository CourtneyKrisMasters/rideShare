<template>
  <v-container>
    <div>
      <h4 class="display-1">Welcome, Single-Page App User</h4>
        <p class="body-1">This is the vehicle page.</p>
        <h4 class="display-1">Add a vehicle</h4> <!-- make, model, color, vehicleTypeId(int), capacity(int), mpg(float), license state, liscence number -->
          <v-form v-model="valid">
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
                <v-row align="left">
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
                <v-text-field
                v-model="vehicleInfo.licenseState"
                v-bind:rules="rules.licenseState"
                error-count="10"
                type="licenseState"
                label="License State"
                required
                ></v-text-field>
                <v-text-field
                v-model="vehicleInfo.licenseNumber"
                v-bind:rules="rules.licenseNumber"
                error-count="10"
                type="licenseNumber"
                label="License Number"
                required
                ></v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="addVehicle"
              >Add Vehicle
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
  name: "AddVehiclePage",
  // components: {
  //   Instructions, // Use the Instructions component we just imported
  // },
  data: function () {
    return {
      valid: false, // Are all the fields in the form valid?

      // Object to collect account data
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

      items: [],
      

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
      capacity: [
        (val) => /^[0-9]*$/.test(val) || "Requires digits",
      ],
      mpg: [
        (val) => /[+-]?([0-9]*[.])?[0-9]+/.test(val) || "Requires a decimal number",
      ],
    };
  },

  //gets all vehicle types for the dropdown
  mounted: function() {
       this.$axios.get("/vehicleTypes").then(response => {
        this.items = response.data.map(item => ({
          id: item.id,
          type: item.type,
        }));
      });
  },

  methods: {
    // Invoked when the user clicks the 'Add vehicles' button.
    addVehicle: function () {
      // Haven't been successful yet.
      this.vehicleAdd = false;

      // Patch the content of the form to the Hapi server.
      this.$axios
        .post("/accounts", {
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
  },
};
</script>


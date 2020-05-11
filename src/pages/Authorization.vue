<!--pop up form to add a new Authorization Driver/Vehicle Pair-->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Authorize a Driver</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col class="d-flex">
                  <v-select
                    v-model="authorizationObject.driverId"
                    :items="driverItems"
                    item-text="name"
                    item-value="id"
                    label="Select Driver"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex">
                  <v-select
                    v-model="authorizationObject.vehicleId"
                    :items="vehicleItems"
                    item-text="licensenumber"
                    item-value="id"
                    label="Select Vehicle"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="handleSubmit" color="primary"
            >Authorize Driver</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
  name: "Authorization",
  data: function () {
    return {
        authorizationObject: {
        driverId: "",
        vehicleId: "",
      },

    driverItems: [],
    vehicleItems: [],

    // Was an account created successfully?
    newauthorizationObjectCreated: false,

    // Data to be displayed by the dialog.
    dialogHeader: "<no dialogHeader>",
    dialogText: "<no dialogText>",
    dialogVisible: false,

    rules: {
        required: [(val) => val.length > 0 || "Required"]
    }
    };
  },

//gets all drivers for the dropdown
mounted: function() {
    this.$axios.get("/drivers").then(response => {
    this.driverItems = response.data.map(item => ({
        id: item.id,
        firstname: item.firstname,
        lastname: item.lastname,
        name: item.firstname + " " + item.lastname,
    }));
    });
    this.$axios.get("/vehicles").then(response => {
    this.vehicleItems = response.data.map(item => ({
        id: item.id,
        licensenumber: item.licensenumber,
    }));
    });
},

  methods: {
      // Invoked when the user clicks the 'Sign Up' button.
    handleSubmit: function () {
      // Haven't been successful yet.
      this.newauthorizationObjectCreated = false;
      console.log("object vehicle id: " + this.authorizationObject.vehicleId);
      this.$axios 
        .post("/authorization", {
          driverId: this.authorizationObject.driverId,
          vehicleId: this.authorizationObject.vehicleId,
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
      console.log(text);
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
    },
  },
};
</script>

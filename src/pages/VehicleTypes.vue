<!--pop up form to add a new Vehicle type-->

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="cyan darken-1" dark flat>
            <v-toolbar-title>Add a Vehicle Type</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="newMember.vehicleType"
                v-bind:rules="rules.required"
                label="Vehicle Type"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="handleSubmit" class="white--text" color="cyan darken-1">Add Type</v-btn>
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
              <v-btn color="cyan darken-1" class="white--text" text v-on:click="hideDialog">Okay</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
        newMember: {
            vehicleType: ""
        },

        // Was an account created successfully?
        newTypeCreated: false,

        // Data to be displayed by the dialog.
        dialogHeader: "<no dialogHeader>",
        dialogText: "<no dialogText>",
        dialogVisible: false,

        rules: {
            required: [(val) => val.length > 0 || "Required"]
        }
    };
  },

  methods: {
      // Invoked when the user clicks the 'Sign Up' button.
    handleSubmit: function () {
      // Haven't been successful yet.
      this.newTypeCreated = false;

      this.$axios
        .post("/vehicleTypes", {
          vehicleType: this.newMember.vehicleType
        })
        .then((result) => {
          // Based on whether things worked or not, show the
          // appropriate dialog.
          this.showDialog("Success", "result.data.msge");
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
            this.newTypeCreated = true;
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
      if (this.newTypeCreated) {
        // Only navigate away from the sign-up page if we were successful.
        this.$router.push({ name: "admin" });
      }
    }
  },
};
</script>

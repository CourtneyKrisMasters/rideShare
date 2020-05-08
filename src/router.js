import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import Admin from "./pages/Admin.vue";
import Driver from "./pages/Driver.vue";
import Passenger from "./pages/Passenger.vue";
import Accounts from "./pages/Accounts.vue";
import Vehicles from "./pages/Vehicles.vue";
import VehicleTypes from "./pages/VehicleTypes.vue";
import Rides from "./pages/Rides.vue";
import AddRides from "./pages/AddRides.vue";
import UpdateVehicle from "./pages/UpdateVehicle.vue";
import UpdateRide from "./pages/UpdateRide.vue";
import Authorization from "./pages/Authorization.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "admin", path: "/admin", component: Admin, Rides },
    { name: "driver", path: "/driver", component: Driver },
    { name: "passenger", path: "/passenger", component: Passenger },
    { name: "accounts", path: "/accounts", component: Accounts },
    { name: "vehicles", path: "/vehicles", component: Vehicles },
    { name: "vehicleTypes", path: "/vehicleTypes", component: VehicleTypes },
    { name: "rides", path: "/rides", component: Rides },
    { name: "addRides", path: "/addRides", component: AddRides },
    { name: "updateVehicle", path: "/updateVehicle", component: UpdateVehicle },
    { name: "updateRide", path: "/updateRide", component: UpdateRide },
    { name: "authorization", path: "/authorization", component: Authorization },
  ]
});

import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import Admin from "./pages/Admin.vue";
import Driver from "./pages/Driver.vue";
import Passenger from "./pages/Passenger.vue";
import Accounts from "./pages/Accounts.vue";
import Vehicles from "./pages/Vehicles.vue";
import Rides from "./pages/Rides.vue"

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
    { name: "rides", path: "/rides", component: Rides }
  ]
});

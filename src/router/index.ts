import { createRouter, createWebHistory } from "vue-router";
import UserList from "@/views/UserList.vue";
import AddUser from "@/views/AddUser.vue";
import EditUser from "@/views/EditUser.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: UserList,
    },
    {
      path: "/add",
      name: "add-user",
      component: AddUser,
    },
    {
      path: "/edit/:id",
      name: "edit-user",
      component: EditUser,
    },
  ],
});

export default router;

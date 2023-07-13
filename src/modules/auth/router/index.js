export const routes = [
  {
    path: "/",
    component: () => import("../layouts/Main.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("../views/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("../views/Register.vue"),
      },
    ],
  },
];

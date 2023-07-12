// import { useStore } from "../../composables/useStore";
import { router } from "@/router/";
import { routes } from "./router";

// //registrar a store local
// const store = useStore();
// store.registerModule("customer", customerStore);

//registrar as rotas locais
routes.forEach((route) => {
  router.addRoute(route);
});
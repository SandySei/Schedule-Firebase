import { reactive } from "vue";
import { signIn, signUp, logout, isLogged } from "../api";

export const authStore = reactive({
  user: {},
  setUser(user) {
    this.user = user;
  },
  async signIn(email, password) {
    const res = await signIn(email, password);
  
    this.user = res;
    return res;
  },
  async signUp(payload) {
    const res = await signUp(payload);

    return res;
  },
  async logout() {
    console.log("Oi");
    return await logout();
  },
  async isLogged() {
    return await isLogged();
  },
});

import { reactive } from "vue";
import { signIn, signUp } from "../api";

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
  signUp: signUp,
});

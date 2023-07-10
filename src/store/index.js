import { reactive } from "vue";

export const store = reactive({
  content: {},
  registerModule(name, module) {
    this.content = { ...this?.content, [name]: { ...module } };
  },
});

import { ref } from "vue";

const globalCount = ref(0);

function globalIncrement() {
  globalCount.value++;
}

export const useCounter = () => {
  const count = ref(0);

  function increment() {
    count.value++;
  }
  return {
    globalCount,
    globalIncrement,
    count,
    increment,
  };
};

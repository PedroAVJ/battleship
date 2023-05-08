<template>
    <svg viewBox="0 0 100 100">
    <path
      d="M 20,20 L 80,80 M 80,20 L 20,80"
      stroke="red"
      stroke-width="10"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

svg {
  pointer-events: none;
  animation: fadeIn 1s ease-out;
}
</style>
<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100">
    <h1 class="primary-text mb-4">
      BattleShip++
    </h1>
    <router-link class="primary-button" :to="{ name: 'MapSelect' }">
      Play Against an AI
    </router-link>
  </div>
</template>

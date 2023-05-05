<template>
  <div class="container">
    <h1 class="title">
      BattleShip++
    </h1>
    <div class="menu">
      <router-link class="menu-item" :to="{ name: 'MapSelect' }">
        Play Against an AI
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  background-color: #ff9800;
  border-radius: 4px;
  color: #e0e0e0;
  display: inline-block;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f57c00;
}
</style>
